from fastapi import HTTPException, status


class AIServiceError(HTTPException):
    def __init__(self, detail: str = "AI service error"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
        )
