import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NaverStrategy } from './strategies/naver.strategy';
import { SessionSerializer } from './session.serializer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [NaverStrategy, SessionSerializer, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
