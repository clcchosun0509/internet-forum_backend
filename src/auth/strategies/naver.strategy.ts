import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const NAVER_CLIENT_ID = configService.get<string>('NAVER_CLIENT_ID');
    const NAVER_CLIENT_SECRET = configService.get<string>(
      'NAVER_CLIENT_SECRET',
    );
    const NAVER_REDIRECT_URL = configService.get<string>('NAVER_REDIRECT_URL');
    super({
      clientID: NAVER_CLIENT_ID,
      clientSecret: NAVER_CLIENT_SECRET,
      callbackURL: NAVER_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { provider, id, emails, displayName, _json } = profile;
    const user = {
      id: `${provider}_${id}`,
      email: emails[0].value,
      username: displayName,
      avatar: _json.profile_image,
      roles: [],
      createdAt: new Date(),
      deletedAt: null,
    };
    return this.authService.validate(user);
  }
}
