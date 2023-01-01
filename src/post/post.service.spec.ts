import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { userStub } from '../user/user.mock';
import { postStub } from './post.mock';
import { PostService } from './post.service';
import { paginate } from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('PostService', () => {
  let service: PostService;
  const postMock = postStub(1, BoardId.Free);
  const postRepositoryMock = {
    create: jest.fn().mockResolvedValue(postMock),
    save: jest.fn((post: Post) => Promise.resolve(post)),
    findOne: jest.fn().mockResolvedValue(postMock),
    increment: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getRepositoryToken(Post), useValue: postRepositoryMock },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
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
      await service.findOneById(postMock.id);
      expect(postRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When increaseViewCountById is called', () => {
    it('should call increment', async () => {
      await service.increaseViewCountById(postMock.id);
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
});
