import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from 'passport-naver';
import { User } from '../../entities';
import { AuthService } from '../auth.service';
import { NaverStrategy } from './naver.strategy';

describe('NaverStrategy', () => {
  let naverStrategy: NaverStrategy;
  let fakeConfigService: Partial<ConfigService>;
  let fakeAuthService: Partial<AuthService>;
  let profile: Profile;

  beforeEach(async () => {
    profile = {
      provider: 'naver',
      id: '1',
      displayName: 'testname',
      emails: [{ value: 'test@test.com' }],
      _json: { profile_image: 'http://test.com/photo.jpg' },
    };
    fakeConfigService = {
      get(value: string) {
        return value;
      },
    };
    fakeAuthService = {
      validate: (user: User) => {
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NaverStrategy,
        { provide: ConfigService, useValue: fakeConfigService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    naverStrategy = module.get<NaverStrategy>(NaverStrategy);
  });

  it('should be defined', () => {
    expect(naverStrategy).toBeDefined();
  });

  describe('When validate is called', () => {
    it('should returns user entity', async () => {
      const user = await naverStrategy.validate('', '', profile);

      expect(user).toEqual({
        id: `${profile.provider}_${profile.id}`,
        email: profile.emails[0].value,
        username: profile.displayName,
        avatar: profile._json.profile_image,
      });

      jest.useRealTimers();
    });
  });
});
