import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const GITHUB_CLIENT_ID = configService.get<string>('GITHUB_CLIENT_ID');
    const GITHUB_CLIENT_SECRET = configService.get<string>(
      'GITHUB_CLIENT_SECRET',
    );
    const GITHUB_REDIRECT_URL = configService.get<string>(
      'GITHUB_REDIRECT_URL',
    );
    super({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_REDIRECT_URL,
      // scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { provider, id, username, photos } = profile;
    const user = {
      id: `${provider}_${id}`,
      email: username,
      username,
      avatar: photos[0].value,
    };
    return this.authService.validate(user);
  }
}
