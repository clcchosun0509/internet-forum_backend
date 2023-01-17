import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from 'passport-github2';
import { User } from '../../entities';
import { AuthService } from '../auth.service';
import { GithubStrategy } from './github.strategy';

describe('GithubStrategy', () => {
  let githubStrategy: GithubStrategy;
  let fakeConfigService: Partial<ConfigService>;
  let fakeAuthService: Partial<AuthService>;
  let profile: Profile;

  beforeEach(async () => {
    profile = {
      provider: 'naver',
      id: '1',
      username: 'testname',
      photos: [{ value: 'test.png' }],
      profileUrl: 'testname',
      displayName: 'testname',
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
        GithubStrategy,
        { provide: ConfigService, useValue: fakeConfigService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    githubStrategy = module.get<GithubStrategy>(GithubStrategy);
  });

  it('should be defined', () => {
    expect(githubStrategy).toBeDefined();
  });

  describe('When validate is called', () => {
    it('should returns user entity', async () => {
      const user = await githubStrategy.validate('', '', profile);

      expect(user).toEqual({
        id: `${profile.provider}_${profile.id}`,
        email: profile.username,
        username: profile.username,
        avatar: profile.photos[0].value,
      });

      jest.useRealTimers();
    });
  });
});
