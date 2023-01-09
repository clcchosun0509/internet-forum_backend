import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../user/user.mock';
import { PostLikeController } from './post-like.controller';
import { PostService } from './post.service';

describe('PostLikeController', () => {
  let controller: PostLikeController;
  const postServiceMock = {
    likePost: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PostService, useValue: postServiceMock }],
      controllers: [PostLikeController],
    }).compile();

    controller = module.get<PostLikeController>(PostLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When likePost is called', () => {
    it('should like post', async () => {
      const res = await controller.likePost(userStub(), {
        postId: 1,
      });
      expect(postServiceMock.likePost).toHaveBeenCalledTimes(1);
      expect(res).toEqual({ status: true });
    });
  });
});
