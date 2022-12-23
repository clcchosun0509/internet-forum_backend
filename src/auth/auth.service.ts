import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { User } from '../entities';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
  ) {}

  async validate(user: DeepPartial<User>) {
    const { id } = user;
    const foundUser = await this.userService.findOneById(id);
    if (!foundUser) {
      return this.userService.create(user);
    }
    return foundUser;
  }
}
