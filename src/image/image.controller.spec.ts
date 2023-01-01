import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { BadRequestException } from '@nestjs/common';

describe('ImageController', () => {
  let controller: ImageController;
  let fakeImageService: Partial<ImageService>;

  beforeEach(async () => {
    fakeImageService = {
      upload: jest.fn(() => Promise.resolve('image-url')),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ImageService, useValue: fakeImageService }],
      controllers: [ImageController],
    }).compile();

    controller = module.get<ImageController>(ImageController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the image service to upload the image', async () => {
    const imageFile = {
      originalname: 'image.jpg',
      buffer: Buffer.from([1, 2, 3]),
    } as any;
    const result = await controller.uploadImage(imageFile);
    expect(fakeImageService.upload).toHaveBeenCalledWith(imageFile);
    expect(result).toEqual('image-url');
  });

  it('should throw a BadRequestException if the image file is not provided', async () => {
    await expect(controller.uploadImage(undefined)).rejects.toThrow(
      BadRequestException,
    );
  });
});
