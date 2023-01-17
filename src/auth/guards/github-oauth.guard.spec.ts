import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GithubOAuthGuard } from './github-oauth.guard';

describe('GithubOAuthGuard', () => {
  let guard: GithubOAuthGuard;

  beforeEach(() => {
    guard = new GithubOAuthGuard();
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

    AuthGuard('github').prototype.canActivate = jest.fn(() =>
      Promise.resolve(returnValueOfSuperCanActivate),
    );
    AuthGuard('github').prototype.logIn = jest.fn(() => Promise.resolve());

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
