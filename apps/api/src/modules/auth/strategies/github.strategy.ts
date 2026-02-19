import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

export interface GithubProfile {
  id: string;
  username: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
  profileUrl: string;
  _json: {
    bio: string;
    location: string;
    [key: string]: any;
  };
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GithubProfile): Promise<any> {
    return await this.authService.validateGithubUser(profile);
  }
}
