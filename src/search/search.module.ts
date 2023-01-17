import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { PostModule } from '../post/post.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          node: configService.get('ES_HOST'),
          maxRetries: 10,
          requestTimeout: 60000,
          pingTimeout: 60000,
        };
      },
    }),
    PostModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
