from fastapi import HTTPException, status


class ConversationNotFound(HTTPException):
    def __init__(self, conversation_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation {conversation_id} not found",
        )


class ConversationForbidden(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this conversation",
        )
