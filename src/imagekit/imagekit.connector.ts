import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { ResponseImageDto } from './dtos/response-image.dto';

@Injectable()
export class ImagekitConnector {
  private connection: AxiosInstance;
  constructor(private readonly configService: ConfigService) {
    this.connection = axios.create({
      baseURL: 'https://upload.imagekit.io/api/v1',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      auth: {
        username: configService.get<string>('IMAGEKIT_PRIVATE_API_KEY'),
        password: undefined,
      },
      timeout: 10000,
    });
  }

  async uploadImage(imageFile: Express.Multer.File): Promise<ResponseImageDto> {
    try {
      const { data } = await this.connection.post<ResponseImageDto>(
        '/files/upload',
        {
          file: Buffer.from(imageFile.buffer).toString('base64'),
          fileName: imageFile.fieldname,
        },
      );
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("이미지 업로드 실패")
    }
  }
}
