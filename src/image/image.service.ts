import { Injectable } from '@nestjs/common';
import { ImagekitConnector } from '../imagekit/imagekit.connector';

@Injectable()
export class ImageService {
  constructor(
    private imagekitConnector: ImagekitConnector,
  ) {}
  async upload(imageFile: Express.Multer.File) {
    const uploadedImage = await this.imagekitConnector.uploadImage(imageFile)
    return uploadedImage.url;
  }
}
