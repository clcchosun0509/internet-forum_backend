import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../entities';
import { PostService } from '../post/post.service';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  const commentRepositoryMock = {};
  let postServiceMock: Partial<PostService> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: commentRepositoryMock,
        },
        {
          provide: PostService,
          useValue: postServiceMock,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
