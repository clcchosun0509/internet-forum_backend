import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(user: DeepPartial<User>) {
    const createdUser = this.repo.create(user);
    return this.repo.save(createdUser);
  }

  findOneById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  deleteById(id: string) {
    return this.repo.softDelete({ id });
  }
}
