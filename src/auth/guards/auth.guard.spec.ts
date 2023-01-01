import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    guard = new AuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if the request is authenticated', async () => {
    const mockContext = createMock<ExecutionContext>();
    mockContext.switchToHttp().getRequest.mockReturnValue({
      isAuthenticated: () => true,
    });
    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should return false if the request is not authenticated', async () => {
    const mockContext = createMock<ExecutionContext>();
    mockContext.switchToHttp().getRequest.mockReturnValue({
      isAuthenticated: () => false,
    });
    const result = await guard.canActivate(mockContext);
    expect(result).toBe(false);
  });
});
