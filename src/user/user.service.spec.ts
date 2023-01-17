import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { User } from '../entities';
import { userStub } from './user.mock';
import { UserService } from './user.service';

jest.mock('../utils', () => ({
  generateRandomString: jest.fn().mockReturnValue('random'),
}));

describe('UserService', () => {
  let service: UserService;
  const userMock = userStub();
  const alreadyExistUsername = 'already_exist_username';
  const userRepositoryMock = {
    create: jest.fn().mockImplementation((user: DeepPartial<User>) => ({
      ...userMock,
      ...user,
    })),
    save: jest.fn((user: User) => Promise.resolve(user)),
    findOneBy: jest.fn(({ id }: { id: string }) => {
      if (id === userMock.id) {
        return Promise.resolve(userMock);
      }
      return Promise.resolve(null);
    }),
    softDelete: jest.fn().mockResolvedValue({}),
    count: jest
      .fn()
      .mockImplementation((query: { where: { username: string } }) => {
        if (query.where.username === alreadyExistUsername) {
          return Promise.resolve(1);
        } else {
          return Promise.resolve(0);
        }
      }),
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
      const res = await service.create({
        ...userMock,
        username: 'new_username',
      });
      expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual({ ...userMock, username: 'new_username' });
    });

    it('should create new user and save even if given username is already exist', async () => {
      const res = await service.create({
        ...userMock,
        username: alreadyExistUsername,
      });
      expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual({
        ...userMock,
        username: `${alreadyExistUsername}_random`,
      });
    });
  });

  describe('When findOneById is called', () => {
    it('should call findOneBy', async () => {
      await service.findOneById(userMock.id);
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('When updateUser is called', () => {
    it('should update user if user is found and given username is unique', async () => {
      const res = await service.updateUser(userMock.id, {
        username: 'new_username',
      });
      expect(res).toEqual({ ...userMock, username: 'new_username' });
    });

    it('should throw not found exception if user by given id is not found', async () => {
      await expect(
        service.updateUser('wrong-id', {
          username: 'new_username',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad request exception if given username is already exist', async () => {
      await expect(
        service.updateUser(userMock.id, {
          username: alreadyExistUsername,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
