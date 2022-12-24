import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';

import RoleGuard from './role.guard';
import { UserRole } from '../../entities/user.entity';

describe('RoleGuard', () => {
  describe('When `canActivate` is called', () => {
    let roleGuard: RoleGuard;
    let reflector: Reflector;
    let mockContext: ExecutionContext;
    let returnValueOfGetRequest;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [RoleGuard, Reflector],
      }).compile();

      roleGuard = module.get(RoleGuard);
      reflector = module.get(Reflector);

      returnValueOfGetRequest = {
        user: {
          roles: [UserRole.ADMIN],
        },
      };

      mockContext = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => returnValueOfGetRequest,
        }),
      });
    });

    it('should return true if the user has the required role', async () => {
      reflector.get = jest.fn().mockReturnValue(UserRole.ADMIN);
      const result = await roleGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return false if the user does not have the required role', async () => {
      reflector.get = jest.fn().mockReturnValue(UserRole.USER);
      const result = await roleGuard.canActivate(mockContext);
      expect(result).toBe(false);
    });

    it('should return true if no role is required', async () => {
      reflector.get = jest.fn().mockReturnValue(undefined);
      const result = await roleGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should return false if the user is not authenticated', async () => {
      returnValueOfGetRequest.user = undefined;
      reflector.get = jest.fn().mockReturnValue(UserRole.ADMIN);
      const result = await roleGuard.canActivate(mockContext);
      expect(result).toBe(false);
    });
  });
});
