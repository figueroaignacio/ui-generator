import secrets

from app.config import settings
from app.database import get_db
from app.modules.auth.deps import get_current_user, get_optional_user
from app.modules.auth.schemas import AuthStatus
from app.modules.auth.service import AuthService
from app.modules.users.model import User
from app.modules.users.service import UserService
from fastapi import APIRouter, Cookie, Depends, Response
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(user_service=UserService(db))


@router.get("/github")
def github_login():
    state = secrets.token_urlsafe(32)
    service = AuthService(user_service=None)
    url = service.get_github_authorize_url(state)
    response = JSONResponse(content={"url": url})
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        max_age=600,
        samesite="lax",
        secure=False,
        path="/",
    )
    return response


@router.get("/github/callback")
async def github_callback(
    code: str,
    state: str,
    oauth_state: str | None = Cookie(default=None),
    svc: AuthService = Depends(get_auth_service),
):
    if not oauth_state or oauth_state != state:
        from app.modules.auth.exceptions import OAuthError

        raise OAuthError("Invalid state parameter")

    redirect = RedirectResponse(f"{settings.frontend_url}/chat")
    redirect.delete_cookie("oauth_state", path="/")
    await svc.handle_github_callback(code, redirect)
    return redirect


@router.get("/google")
def google_login():
    state = secrets.token_urlsafe(32)
    service = AuthService(user_service=None)
    url = service.get_google_authorize_url(state)
    response = JSONResponse(content={"url": url})
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        max_age=600,
        samesite="lax",
        secure=False,
        path="/",
    )
    return response


@router.get("/google/callback")
async def google_callback(
    code: str,
    state: str,
    oauth_state: str | None = Cookie(default=None),
    svc: AuthService = Depends(get_auth_service),
):
    if not oauth_state or oauth_state != state:
        from app.modules.auth.exceptions import OAuthError

        raise OAuthError("Invalid state parameter")

    redirect = RedirectResponse(f"{settings.frontend_url}/chat")
    redirect.delete_cookie("oauth_state", path="/")
    await svc.handle_google_callback(code, redirect)
    return redirect


@router.post("/refresh")
async def refresh_tokens(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    svc: AuthService = Depends(get_auth_service),
):
    from app.modules.auth.exceptions import InvalidToken

    if not refresh_token:
        raise InvalidToken()
    await svc.refresh_tokens(refresh_token, response)
    return {"message": "tokens refreshed"}


@router.post("/logout")
async def logout(
    response: Response,
    user: User = Depends(get_current_user),
    svc: AuthService = Depends(get_auth_service),
):
    await svc.logout(user, response)
    return {"message": "logged out"}


@router.get("/status", response_model=AuthStatus)
async def auth_status(
    user: User | None = Depends(get_optional_user),
    svc: AuthService = Depends(get_auth_service),
):
    return svc.get_auth_status(user)
