import { Test, TestingModule } from '@nestjs/testing';
import { Post, User } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { userStub } from '../user/user.mock';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostController } from './post.controller';
import { postStub } from './post.mock';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  const postMock = postStub(1, BoardId.Free);
  const postServiceMock = {
    create: jest.fn().mockResolvedValue(postMock),
    increaseViewCountById: jest.fn().mockResolvedValue(true),
    findOneById: jest.fn().mockResolvedValue(postMock),
    updatePost: jest.fn(
      (id: number, user: User, updatePostDto: UpdatePostDto) => {
        const updatedPost: Post = {
          ...postMock,
          title: updatePostDto.title,
          content: updatePostDto.content,
        };
        return Promise.resolve(updatedPost);
      },
    ),
    deletePost: jest.fn().mockResolvedValue({}),
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

  describe('When updatePost is called', () => {
    it('should update post and return post', async () => {
      const updatePostDto = {
        title: 'new title',
        content: 'new content',
      };
      const res = await controller.updatePost(
        postMock.id,
        userStub(),
        updatePostDto,
      );
      expect(postServiceMock.updatePost).toHaveBeenCalledTimes(1);
      expect(res).toEqual({
        ...postMock,
        title: updatePostDto.title,
        content: updatePostDto.content,
      });
    });
  });

  describe('When deletePost is called', () => {
    it('should delete post', async () => {
      const res = await controller.deletePost(1, userStub());
      expect(postServiceMock.deletePost).toHaveBeenCalledTimes(1);
      expect(res).toEqual({ status: true });
    });
  });
});
