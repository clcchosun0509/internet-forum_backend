import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as createRedisStore from 'connect-redis';
import { createClient } from 'redis';
import * as passport from 'passport';

export default async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  const RedisStore = createRedisStore(session);
  const redisHost: string = configService.get('REDIS_HOST');
  const redisPort: number = configService.get('REDIS_PORT');
  const redisPassword: number = configService.get('REDIS_PASSWORD');
  const redisClient = createClient({
    url: `redis://default:${redisPassword}@${redisHost}:${redisPort}`,
    legacyMode: true,
  });
  redisClient.connect().catch(console.error);
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
