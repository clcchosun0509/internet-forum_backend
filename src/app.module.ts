import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { BoardModule } from './board/board.module';
import { ImageModule } from './image/image.module';
import { CommentModule } from './comment/comment.module';
import { SearchModule } from './search/search.module';
import * as entities from './entities'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          synchronize: true,
          entities,
        };
      },
    }),
    UserModule,
    AuthModule,
    PostModule,
    BoardModule,
    ImageModule,
    CommentModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
