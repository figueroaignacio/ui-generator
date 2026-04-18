from app.modules.conversations.exceptions import (
    ConversationForbidden,
    ConversationNotFound,
)
from app.modules.conversations.model import Conversation, Message
from app.modules.conversations.repo import ConversationRepository
from app.modules.conversations.schemas import ConversationCreate, MessageCreate
from app.modules.users.model import User
from sqlalchemy.ext.asyncio import AsyncSession


class ConversationService:
    def __init__(self, db: AsyncSession):
        self.repo = ConversationRepository(db)

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
        await self.repo.touch(conv.id)
        return message

    async def delete(self, conversation_id: str, user: User) -> None:
        conv = await self.repo.find_one(conversation_id)
        if not conv:
            raise ConversationNotFound(conversation_id)
        if conv.user_id != user.id:
            raise ConversationForbidden()
        await self.repo.delete(conversation_id)
