import { Injectable } from '@nestjs/common';
import { User } from '../entities';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
  ) {}

  async validate(user: User) {
    const { id } = user;
    const foundUser = await this.userService.findOneById(id);
    if (!foundUser) {
      return this.userService.create(user);
    }
    return foundUser;
  }
}
