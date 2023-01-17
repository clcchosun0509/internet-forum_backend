import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../entities';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as _ from 'lodash';
import { generateRandomString } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(user: DeepPartial<User>) {
    const copiedUser = _.cloneDeep(user);
    if (copiedUser.username) {
      try {
        await this.validateUsername(copiedUser.username)
      } catch {
        copiedUser.username = `${copiedUser.username}_${generateRandomString(10)}`
      }
    }
    const createdUser = this.repo.create(copiedUser);
    return this.repo.save(createdUser);
  }

  findOneById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    if (updateUserDto.username) {
      await this.validateUsername(updateUserDto.username);
    }

    return this.repo.save({ ...user, ...updateUserDto });
  }

  deleteById(id: string) {
    return this.repo.softDelete({ id });
  }

  protected async validateUsername(username: string) {
    const countUsername = await this.repo.count({
      where: { username },
    });
    if (countUsername > 0)
      throw new BadRequestException('이미 닉네임이 존재합니다.');
  }
}
