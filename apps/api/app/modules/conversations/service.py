import asyncio
from collections.abc import AsyncGenerator

from app.modules.ai.service import AIService
from app.modules.conversations.exceptions import (
    ConversationForbidden,
    ConversationNotFound,
)
from app.modules.conversations.model import Conversation, Message, MessageRole
from app.modules.conversations.repo import ConversationRepository
from app.modules.conversations.schemas import ConversationCreate, MessageCreate
from app.modules.users.model import User
from sqlalchemy.ext.asyncio import AsyncSession


class ConversationService:
    def __init__(self, db: AsyncSession):
        self.repo = ConversationRepository(db)
        self.ai = AIService()

    async def create(self, user: User, dto: ConversationCreate) -> Conversation:
        return await self.repo.create(user_id=user.id, title=dto.title)

    async def list_for_user(self, user: User) -> list[Conversation]:
        return await self.repo.find_by_user(user.id)

    async def get_with_messages(self, conversation_id: str, user: User) -> Conversation:
        conv = await self.repo.find_one_with_messages(conversation_id)
        if not conv:
            raise ConversationNotFound(conversation_id)
        if conv.user_id != user.id:
            raise ConversationForbidden()
        return conv

    async def add_message(
        self, conversation_id: str, user: User, dto: MessageCreate
    ) -> Message:
        conv = await self.get_with_messages(conversation_id, user)
        message = await self.repo.create_message(
            conversation_id=conv.id,
            role=dto.role,
            content=dto.content,
            parts=dto.parts,
        )
        if dto.role == MessageRole.USER and not conv.title:
            asyncio.create_task(self._generate_title_safe(conv.id, dto.content))
        await self.repo.touch(conv.id)
        return message

    async def generate_stream(
        self, conversation_id: str, user: User, user_content: str
    ) -> AsyncGenerator[str, None]:
        conv = await self.get_with_messages(conversation_id, user)

        await self.repo.create_message(
            conversation_id=conv.id,
            role=MessageRole.USER,
            content=user_content,
        )

        if not conv.title:
            asyncio.create_task(self._generate_title_safe(conv.id, user_content))

        history = [
            {"role": msg.role.value, "content": msg.content} for msg in conv.messages
        ] + [{"role": "user", "content": user_content}]

        # acumular respuesta
        full_response: list[str] = []

        async def _stream():
            async for chunk in self.ai.generate_stream(history):
                full_response.append(chunk)
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"

        async for chunk in _stream():
            yield chunk

        await self.repo.create_message(
            conversation_id=conv.id,
            role=MessageRole.ASSISTANT,
            content="".join(full_response),
        )
        await self.repo.touch(conv.id)

    async def delete(self, conversation_id: str, user: User) -> None:
        conv = await self.repo.find_one(conversation_id)
        if not conv:
            raise ConversationNotFound(conversation_id)
        if conv.user_id != user.id:
            raise ConversationForbidden()
        await self.repo.delete(conversation_id)

    async def _generate_title_safe(
        self, conversation_id: str, first_message: str
    ) -> None:
        try:
            title = await self.ai.generate_title(first_message)
            await self.repo.update_title(conversation_id, title)
        except Exception:
            pass
