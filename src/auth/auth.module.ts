import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './strategies/naver.strategy';
import { SessionSerializer } from './session.serializer';
import { UserModule } from '../user/user.module';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [UserModule],
  providers: [NaverStrategy, GithubStrategy, SessionSerializer, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
