import { Test, TestingModule } from '@nestjs/testing';
import { ImagekitConnector } from '../imagekit/imagekit.connector';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;
  let fakeImagekitConnector: Partial<ImagekitConnector>;

  beforeEach(async () => {
    fakeImagekitConnector = {
      uploadImage: jest.fn(() => Promise.resolve({ url: 'image-url' } as any)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ImagekitConnector, useValue: fakeImagekitConnector },
        ImageService,
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the imagekit connector to upload the image', async () => {
    const imageFile = {
      originalname: 'image.jpg',
      buffer: Buffer.from([1, 2, 3]),
    } as any;
    const result = await service.upload(imageFile);
    expect(fakeImagekitConnector.uploadImage).toHaveBeenCalledWith(imageFile);
    expect(result).toEqual('image-url');
  });
});
