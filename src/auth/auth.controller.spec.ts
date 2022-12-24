import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import * as httpMocks from 'node-mocks-http';
import { userStub } from '../user/user.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeConfigService: Partial<ConfigService>;
  let fakeClientURL = 'http://clienturl.com';

  beforeEach(async () => {
    fakeConfigService = {
      get: (propertyPath: string) => {
        if (propertyPath === 'CLIENT_URL') {
          return fakeClientURL;
        }
        return undefined;
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: ConfigService, useValue: fakeConfigService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When naverLogin is called', () => {
    it('should return undefined', async () => {
      const res = controller.naverLogin();
      expect(res).toBeUndefined();
    });
  });

  describe('When naverRedirect is called', () => {
    it('should send user information cookies and redirect to client url', async () => {
      const userMock = userStub();
      const requestMock = httpMocks.createRequest({ user: userMock });
      const responseMock = httpMocks.createResponse();
      
      jest.spyOn(responseMock, 'redirect');
      controller.naverRedirect(requestMock, responseMock);

      expect(responseMock.cookies).toEqual({
        logged_in: { value: true, options: { httpOnly: false } },
        email: { value: userMock.email, options: { httpOnly: false } },
        username: { value: userMock.username, options: { httpOnly: false } },
        avatar: {
          value: userMock.avatar,
          options: { httpOnly: false },
        },
      });
      expect(responseMock.statusCode).toEqual(302);
      expect(responseMock.redirect).toHaveBeenCalledWith(fakeClientURL);
    });
  });

  describe('When status is called', () => {
    it('should return user', async () => {
      const requestMock = httpMocks.createRequest({ user: userStub() });
      const res = controller.status(requestMock);
      expect(res).toEqual(userStub());
    });
  });
});
