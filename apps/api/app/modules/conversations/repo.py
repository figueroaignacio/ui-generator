from app.modules.conversations.model import Conversation, Message, MessageRole
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


class ConversationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user_id: str, title: str | None = None) -> Conversation:
        conversation = Conversation(user_id=user_id, title=title)
        self.db.add(conversation)
        await self.db.flush()
        await self.db.refresh(conversation)
        return conversation

    async def find_by_user(self, user_id: str) -> list[Conversation]:
        result = await self.db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(desc(Conversation.updated_at))
        )
        return list(result.scalars().all())

    async def find_one(self, conversation_id: str) -> Conversation | None:
        result = await self.db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        return result.scalar_one_or_none()

    async def find_one_with_messages(self, conversation_id: str) -> Conversation | None:
        result = await self.db.execute(
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .options(selectinload(Conversation.messages))
        )
        return result.scalar_one_or_none()

    async def update_title(self, conversation_id: str, title: str) -> None:
        conversation = await self.find_one(conversation_id)
        if conversation:
            conversation.title = title
            await self.db.flush()

    async def touch(self, conversation_id: str) -> None:
        from sqlalchemy import func, update

        await self.db.execute(
            update(Conversation)
            .where(Conversation.id == conversation_id)
            .values(updated_at=func.now())
        )

    async def delete(self, conversation_id: str) -> None:
        conversation = await self.find_one(conversation_id)
        if conversation:
            await self.db.delete(conversation)
            await self.db.flush()

    async def create_message(
        self,
        conversation_id: str,
        role: MessageRole,
        content: str,
        parts: list | None = None,
    ) -> Message:
        message = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            parts=parts,
        )
        self.db.add(message)
        await self.db.flush()
        await self.db.refresh(message)
        return message
