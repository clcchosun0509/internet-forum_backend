import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('imageFile', { limits: { fileSize: 5 * 1024 * 1024 } }), //5MB 제한
  )
  async uploadImage(@UploadedFile() imageFile?: Express.Multer.File) {
    if (!imageFile) {
      throw new BadRequestException('이미지 파일이 존재하지 않습니다.');
    }

    return await this.imageService.upload(imageFile);
  }
}
