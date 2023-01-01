import { Test, TestingModule } from '@nestjs/testing';
import { BoardId } from '../entities/board-id.type';
import { userStub } from '../user/user.mock';
import { PostController } from './post.controller';
import { postStub } from './post.mock';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  const postMock = postStub(1, BoardId.Free)
  const postServiceMock = {
    create: jest.fn().mockResolvedValue(postMock),
    increaseViewCountById: jest.fn().mockResolvedValue(true),
    findOneById: jest.fn().mockResolvedValue(postMock)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PostService, useValue: postServiceMock }],
      controllers: [PostController],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When createPost is called', () => {
    it('should create new post', async () => {
      const res = await controller.createPost(userStub(), {
        title: postMock.title,
        content: postMock.content,
        boardId: postMock.boardId,
      });
      expect(postServiceMock.create).toHaveBeenCalledTimes(1);
      expect(res).toEqual(postMock);
    });
  });

  describe('When getPost is called', () => {
    it('should increase view count and return a post by id', async () => {
      const res = await controller.getPost(1);
      expect(postServiceMock.increaseViewCountById).toHaveBeenCalledTimes(1);
      expect(postServiceMock.findOneById).toHaveBeenCalledTimes(1);
      expect(res).toEqual(postMock);
    });
  });
});
