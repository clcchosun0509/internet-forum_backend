import { Module } from '@nestjs/common';
import { ImagekitConnector } from '../imagekit/imagekit.connector';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  controllers: [ImageController],
  providers: [ImageService, ImagekitConnector]
})
export class ImageModule {}
