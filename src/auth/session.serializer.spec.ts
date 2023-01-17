import { Test, TestingModule } from '@nestjs/testing';
import { Done } from '../types';
import { userStub } from '../user/user.mock';
import { UserService } from '../user/user.service';
import { SessionSerializer } from './session.serializer';

describe('SessionSerializer', () => {
  let sessionSerializer: SessionSerializer;
  const userId = 'test_1';
  const userMock = userStub(userId);
  const userServiceMock = {
    findOneById: jest.fn((id: string) => {
      if (id === userId) {
        return userMock;
      } else {
        return null;
      }
    })
  };
  let done: Done;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionSerializer,
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    sessionSerializer = module.get<SessionSerializer>(SessionSerializer);
    done = jest.fn((err, user) => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sessionSerializer).toBeDefined();
  });

  it('should serialize user', () => {
    sessionSerializer.serializeUser(userMock, done);
    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith(null, userMock);
  });

  describe('When deserializeUser is called', () => {
    it('should deserialize user if user found', async () => {
      await sessionSerializer.deserializeUser(userMock, done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(null, userMock);
    });

    it('should deserialize user as null if user not found', async () => {
      await sessionSerializer.deserializeUser(userStub("wrong_user"), done);
      expect(done).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalledWith(null, null);
    })
  });
});
