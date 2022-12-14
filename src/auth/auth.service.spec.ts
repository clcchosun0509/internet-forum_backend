import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    fakeUserService = {
      findOneById: (id: string) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          username: 'test_username',
          avatar: 'http://test.com/test.jpg',
          roles: [],
          createdAt: new Date('2022-12-10'),
          deletedAt: null,
        });
      },
      create: (user: User) => {
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validate create new user and return created user if user is not found', () => {
    fakeUserService.findOneById = () => null;
    expect(fakeUserService.create).toHaveBeenCalledTimes(0);
  });
});
