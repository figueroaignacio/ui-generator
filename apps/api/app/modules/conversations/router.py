from app.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.conversations.schemas import (
    ConversationCreate,
    ConversationRead,
    MessageCreate,
    MessageRead,
)
from app.modules.conversations.service import ConversationService
from app.modules.users.model import User
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/conversations", tags=["conversations"])


def get_service(db: AsyncSession = Depends(get_db)) -> ConversationService:
    return ConversationService(db)


@router.post("/", response_model=ConversationRead, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    dto: ConversationCreate,
    user: User = Depends(get_current_user),
    svc: ConversationService = Depends(get_service),
):
    return await svc.create(user, dto)


@router.get("/", response_model=list[ConversationRead])
async def list_conversations(
    user: User = Depends(get_current_user),
    svc: ConversationService = Depends(get_service),
):
    return await svc.list_for_user(user)


@router.get("/{conversation_id}", response_model=ConversationRead)
async def get_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
    svc: ConversationService = Depends(get_service),
):
    return await svc.get_with_messages(conversation_id, user)


@router.post(
    "/{conversation_id}/messages",
    response_model=MessageRead,
    status_code=status.HTTP_201_CREATED,
)
async def add_message(
    conversation_id: str,
    dto: MessageCreate,
    user: User = Depends(get_current_user),
    svc: ConversationService = Depends(get_service),
):
    return await svc.add_message(conversation_id, user, dto)


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
    svc: ConversationService = Depends(get_service),
):
    await svc.delete(conversation_id, user)
