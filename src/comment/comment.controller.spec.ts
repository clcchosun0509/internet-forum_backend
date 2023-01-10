import { Test, TestingModule } from '@nestjs/testing';
import { userStub } from '../user/user.mock';
import { CommentController } from './comment.controller';
import { commentsStub, commentStub } from './comment.mock';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let controller: CommentController;
  const commentMock = commentStub('comment 1', 1);
  const commentReplyMock = {
    ...commentMock,
    id: 'child id',
    parentCommentUsername: 'parent user',
    parentCommentUserId: 'parent id',
    parentComment: commentMock,
  };
  const commentServiceMock = {
    getCommentsByPostId: jest.fn(
      (page: number, limit: number, postId: number) => {
        return Promise.resolve(commentsStub(limit, postId));
      },
    ),
    createComment: jest.fn().mockResolvedValue(commentMock),
    createReplyComment: jest.fn().mockResolvedValue(commentReplyMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CommentService, useValue: commentServiceMock }],
      controllers: [CommentController],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When getCommentsByPostId is called', () => {
    it('should return a paginated list of comments', async () => {
      const postId = 111;
      const page = 1;
      const result = await controller.getCommentsByPostId(postId, page);
      expect(commentServiceMock.getCommentsByPostId).toHaveBeenCalledWith(
        page,
        10,
        postId,
      );
      expect(result).toEqual(commentsStub(10, postId));
    });
  });

  describe('When createComment is called', () => {
    it('should create new comment', async () => {
      const res = await controller.createComment(userStub(), {
        postId: commentMock.postId,
        content: commentMock.content,
      });
      expect(commentServiceMock.createComment).toHaveBeenCalledTimes(1);
      expect(res).toEqual(commentMock);
    });
  });

  describe('When createReplyComment is called', () => {
    it('should create new reply comment', async () => {
      const res = await controller.createReplyComment(userStub(), {
        commentId: commentReplyMock.id,
        content: commentReplyMock.content,
      });
      expect(commentServiceMock.createReplyComment).toHaveBeenCalledTimes(1);
      expect(res).toEqual(commentReplyMock);
    });
  });
});
