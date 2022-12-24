import { createMock } from '@golevelup/ts-jest';
import { NaverOAuthGuard } from './naver-oauth.guard';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

describe('NaverOAuthGuard', () => {
  let guard: NaverOAuthGuard;

  beforeEach(() => {
    guard = new NaverOAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('When `canActivate` is called', () => {
    const returnValueOfGetRequest = 'request';
    const returnValueOfSuperCanActivate = true;
    const mockContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => returnValueOfGetRequest,
        getResponse: () => ({}),
      }),
    });

    AuthGuard('naver').prototype.canActivate = jest.fn(() =>
      Promise.resolve(returnValueOfSuperCanActivate),
    );
    AuthGuard('naver').prototype.logIn = jest.fn(() => Promise.resolve());

    it('should return same boolean value of `super.canActivate`', async () => {
      expect(await guard.canActivate(mockContext)).toBe(
        returnValueOfSuperCanActivate,
      );
    });

    it('should call logIn with the request', async () => {
      await guard.canActivate(mockContext);
      expect(guard.logIn).toHaveBeenCalledWith(returnValueOfGetRequest);
    });
  });
});
