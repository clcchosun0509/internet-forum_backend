import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../entities';
import { PostService } from '../post/post.service';
import { CommentService } from './comment.service';
import { commentsStub, commentStub } from './comment.mock';
import { NotFoundException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;
  const limit = 10;
  const postId = 1;
  const commentId = 'test_comment_id_1';
  const childCommentId = 'test_comment_id_2';
  const commentMock = commentStub(commentId, postId);
  const childCommentMock = commentStub(childCommentId, postId, commentId);
  const commentsMock = commentsStub(limit, postId);
  const whereSpy = jest.fn().mockReturnThis();
  const leftJoinAndSelectSpy = jest.fn().mockReturnThis();

  const commentRepositoryMock = {
    createQueryBuilder: jest.fn().mockImplementation(() => ({
      where: whereSpy,
      leftJoinAndSelect: leftJoinAndSelectSpy,
      getMany: jest.fn().mockResolvedValueOnce(commentsMock.items),
    })),
    create: jest.fn().mockImplementation((partialComment: Partial<Comment>) => {
      if (partialComment.parentComment?.id === commentId) {
        return childCommentMock;
      } else {
        return commentMock;
      }
    }),
    save: jest
      .fn()
      .mockImplementation((comment: Comment) => Promise.resolve(comment)),
    findOne: jest
      .fn()
      .mockImplementation(
        (query: { where: { id: string }; relations: { author: boolean } }) => {
          if (query.relations.author && query.where.id === commentId) {
            return Promise.resolve(commentMock);
          } else {
            return Promise.resolve(null);
          }
        },
      ),
  };
  let postServiceMock = {
    findOneById: jest.fn().mockImplementation((id: number) => {
      if (id === postId) {
        return commentMock.post;
      } else {
        return null;
      }
    }),
  };

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When getCommentsByPostId is called', () => {
    it('should return a paginated list of comment', async () => {
      const res = await service.getCommentsByPostId(1, limit, postId);
      expect(res).toEqual(commentsMock);
      expect(whereSpy).toHaveBeenCalledWith('comment.post_id = :postId', {
        postId: postId,
      });
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(leftJoinAndSelectSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('When createComment is called', () => {
    it('should save a comment if related post is found', async () => {
      const res = await service.createComment(
        { postId, content: commentMock.content },
        commentMock.author,
      );
      expect(res).toEqual(commentMock);
    });

    it('should throw not found exception if related post is not found', async () => {
      await expect(
        service.createComment(
          { postId: 9999, content: commentMock.content },
          commentMock.author,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('When createReplyComment is called', () => {
    it('should save a reply comment if parent comment is exist', async () => {
      const res = await service.createReplyComment(
        { commentId, content: childCommentMock.content },
        childCommentMock.author,
      );
      expect(res).toEqual(childCommentMock);
    });

    it('should throw not found exception if parent comment is not exist', async () => {
      await expect(
        service.createReplyComment(
          {
            commentId: 'wrong_parent_comment_id',
            content: childCommentMock.content,
          },
          childCommentMock.author,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
