import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities';
import { userStub } from '../user/user.mock';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    fakeUserService = {
      findOneById: (id: string) => {
        return Promise.resolve({
          ...userStub(),
          id,
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

  describe('When validate is called', () => {
    it('should create new user and return created user if user is not found', async () => {
      fakeUserService.findOneById = () => null;
      const userServiceCreateFn = jest.spyOn(fakeUserService, 'create');
      const res = await service.validate(userStub());
      expect(userServiceCreateFn).toHaveBeenCalledTimes(1);
      expect(res).toEqual(userStub());
    });

    it('should return found user if user is found', async () => {
      const userServiceCreateFn = jest.spyOn(fakeUserService, 'create');
      const res = await service.validate(userStub());
      expect(userServiceCreateFn).toHaveBeenCalledTimes(0);
      expect(res).toEqual(userStub());
    });
  });
});
