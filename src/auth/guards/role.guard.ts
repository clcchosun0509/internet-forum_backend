import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const role = this.reflector.get<UserRole>('role', context.getHandler());
    if (!role) return true; // role이 필요없는 리소스는 넘어감

    const user = request.user as User | undefined;
    if (!user) {
      return false;
    }

    return user.roles.includes(role);
  }
}

export default RoleGuard;
