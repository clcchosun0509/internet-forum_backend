import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post, PostLike } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { userStub } from '../user/user.mock';
import { postLikeStub, postStub } from './post.mock';
import { PostService } from './post.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource, FindOperator } from 'typeorm';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('PostService', () => {
  let service: PostService;
  const postId = 1;
  const postIds = [1, 2, 3];
  const boardId = BoardId.Free;
  const userId = 'test';
  const postMock = postStub(postId, boardId);
  const postLikeMock = postLikeStub(postId, boardId, userId);
  const postRepositoryMock = {
    create: jest.fn().mockResolvedValue(postMock),
    save: jest.fn((post: Post) => Promise.resolve(post)),
    findOne: jest.fn(
      ({ where: { id: receivedId } }: { where: { id: number } }) => {
        if (postId === receivedId) {
          return Promise.resolve(postMock);
        } else {
          return Promise.resolve(null);
        }
      },
    ),
    increment: jest.fn().mockResolvedValue({}),
    find: jest.fn((query: {
      where: { id: FindOperator<number[]> },
      relations: string[],
      order: { createdAt: string },
    }) => {
      return Promise.resolve(query.where.id.value.map((id) => postStub(id, boardId)))
    })
  };

  const postLikeRepositoryMock = {
    create: jest.fn().mockResolvedValue(postLikeMock),
    save: jest.fn((postLike: PostLike) => Promise.resolve(postLike)),
    findOne: jest.fn(
      ({
        where: { postId: receivedPostId, userId: receivedUserId },
      }: {
        where: { postId: number; userId: string };
      }) => {
        if (receivedPostId === postId && receivedUserId === userId) {
          return Promise.resolve(postLikeMock);
        } else {
          return Promise.resolve(null);
        }
      },
    ),
  };

  const dataSource = {
    createQueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        getRepository: jest.fn().mockImplementation(() => ({
          save: jest.fn(),
        })),
      },
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getRepositoryToken(Post), useValue: postRepositoryMock },
        {
          provide: getRepositoryToken(PostLike),
          useValue: postLikeRepositoryMock,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When create is called', () => {
    it('should create new post and save', async () => {
      const res = await service.create(
        {
          title: postMock.title,
          content: postMock.content,
          boardId: postMock.boardId,
        },
        userStub(),
      );
      expect(postRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(postRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(res).toEqual(postMock);
    });
  });

  describe('When findOneById is called', () => {
    it('should call findOne', async () => {
      await service.findOneById(postId);
      expect(postRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When increaseViewCountById is called', () => {
    it('should call increment', async () => {
      await service.increaseViewCountById(postId);
      expect(postRepositoryMock.increment).toHaveBeenCalledTimes(1);
    });
  });

  describe('When getPostsByBoardId is called', () => {
    it('should return a paginated list of post', async () => {
      await service.getPostsByBoardId(1, 30, BoardId.Free);
      expect(paginate).toHaveBeenCalledTimes(1);
      expect(paginate).toHaveBeenCalledWith(
        postRepositoryMock,
        { page: 1, limit: 30 },
        expect.objectContaining({}),
      );
    });
  });

  describe('When getPostsByPostIds is called', () => {
    it('should return posts', async () => {
      const res = await service.getPostsByPostIds(postIds);
      expect(res).toEqual([postStub(postIds[0], boardId), postStub(postIds[1], boardId), postStub(postIds[2], boardId)])
    })
  });

  describe('When likePost is called', () => {
    it('should like post', async () => {
      expect(
        service.likePost(postId, userStub('other user')),
      ).resolves.not.toThrow();
    });

    it('throw bad request exception if user has already liked the post', async () => {
      await expect(service.likePost(postId, userStub(userId))).rejects.toThrow(
        BadRequestException,
      );
      expect(postLikeRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    });

    it('throw not found exception if post does not exist', async () => {
      await expect(service.likePost(777, userStub(userId))).rejects.toThrow(
        NotFoundException,
      );
      expect(postLikeRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(postRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
