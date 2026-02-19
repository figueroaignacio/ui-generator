import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string;
  username: string;
  githubId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateGithubUser(profile: any): Promise<User> {
    const { id, username, displayName, emails, photos, profileUrl, _json } = profile;

    let user = await this.usersService.findByGithubId(id);

    if (!user) {
      user = await this.usersService.create({
        githubId: id,
        username: username || displayName,
        email: emails?.[0]?.value || null,
        avatarUrl: photos?.[0]?.value || null,
        bio: _json?.bio || null,
        location: _json?.location || null,
        profileUrl: profileUrl || `https://github.com/${username}`,
      });
    }

    return user;
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      githubId: user.githubId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
