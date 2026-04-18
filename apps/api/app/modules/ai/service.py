from collections.abc import AsyncGenerator

from app.config import settings
from app.modules.ai.exceptions import AIServiceError
from google import genai
from google.genai import types


class AIService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = settings.gemini_model

    async def generate_response(self, history: list[dict]) -> str:
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=self._build_contents(history),
            )
            return response.text
        except Exception as e:
            raise AIServiceError(detail=str(e))

    async def generate_stream(self, history: list[dict]) -> AsyncGenerator[str, None]:
        try:
            async for chunk in await self.client.aio.models.generate_content_stream(
                model=self.model,
                contents=self._build_contents(history),
            ):
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            raise AIServiceError(detail=str(e))

    async def generate_title(self, first_message: str) -> str:
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=(
                    f"Generate a concise chat title (max 6 words, "
                    f"same language as the message): {first_message}"
                ),
            )
            return response.text.strip()
        except Exception as e:
            raise AIServiceError(detail=str(e))

    def _build_contents(self, history: list[dict]) -> list[types.Content]:
        return [
            types.Content(
                role=msg["role"],
                parts=[types.Part(text=msg["content"])],
            )
            for msg in history
        ]
