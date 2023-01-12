import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities';
import { userStub } from './user.mock';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const userRepositoryMock = {
    create: jest.fn().mockResolvedValue(userStub()),
    save: jest.fn((user: User) => Promise.resolve(user)),
    findOneBy: jest.fn(({ id }: { id: string }) => {
      if (id === userStub().id) {
        return Promise.resolve(userStub());
      }
      return Promise.resolve(null);
    }),
    softDelete: jest.fn().mockResolvedValue({}),
    count: jest.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When create is called', () => {
    it('should create new user and save', async () => {
      const res = await service.create(userStub());
      expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual(userStub());
    });
  });

  describe('When findOneById is called', () => {
    it('should call findOneBy', async () => {
      await service.findOneById(userStub().id);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  // describe('When update is called', () => {
  //   it('should update user if user found', async () => {
  //     const updatedUsername = 'newUsername';
  //     const res = await service.update(userStub().id, {
  //       username: updatedUsername,
  //     });
  //     expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
  //     expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
  //     expect(res).toEqual({...userStub(), username: updatedUsername})
  //   });

  //   it('should throw NotFoundException if user not found', async () => {
  //     await expect(service.update("no_user_id", {})).rejects.toThrow(NotFoundException)
  //     expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
  //   });
  // });
});
