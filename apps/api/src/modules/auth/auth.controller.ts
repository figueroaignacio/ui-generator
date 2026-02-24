import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(req.user);
    this.setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${this.configService.get<string>('FRONTEND_URL')}/auth/callback`);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(req.user);
    this.setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${this.configService.get<string>('FRONTEND_URL')}/auth/callback`);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.user.id,
      req.cookies?.refresh_token,
    );

    this.setAuthCookies(res, accessToken, refreshToken);

    return res.status(HttpStatus.OK).json({
      message: 'Tokens refreshed successfully',
    });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res() res: Response) {
    await this.authService.logout(req.user.id);

    res.clearCookie('access_token', this.getCookieOptions());
    res.clearCookie('refresh_token', this.getCookieOptions());

    return res.status(HttpStatus.OK).json({
      message: 'Logged out successfully',
    });
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getStatus(@Req() req) {
    return {
      authenticated: true,
      user: req.user,
    };
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('access_token', accessToken, {
      ...this.getCookieOptions(),
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      ...this.getCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private getCookieOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('strict' as const) : ('lax' as const),
      domain: this.configService.get<string>('COOKIE_DOMAIN'),
      path: '/',
    };
  }
}
