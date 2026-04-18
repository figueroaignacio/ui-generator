from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: MessageRole
    content: str
    parts: list | None = None
    conversation_id: str
    created_at: datetime


class ConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    user_id: str
    created_at: datetime
    updated_at: datetime
    messages: list[MessageRead] = []


class ConversationCreate(BaseModel):
    title: str | None = None


class MessageCreate(BaseModel):
    role: MessageRole
    content: str
    parts: list | None = None


class StreamRequest(BaseModel):
    content: str
