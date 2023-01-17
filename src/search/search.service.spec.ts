import { SearchRequest } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardId } from '../entities/board-id.type';
import { postsStub, postStub } from '../post/post.mock';
import { PostService } from '../post/post.service';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  const title = 'test title';
  const boardId = BoardId.Free;
  const page = 1;
  const limit = 10;
  const postIds = [1, 2];
  const postsMock = postsStub(limit, boardId, [
    postStub(postIds[0], boardId, title),
    postStub(postIds[1], boardId, title),
  ]);

  const elasticsearchServiceMock = {
    search: jest.fn().mockImplementation((searchParams: SearchRequest) => ({
      hits: {
        hits: [
          { _source: { id: postIds[0] } },
          { _source: { id: postIds[1] } },
        ],
        total: { valueOf: () => ({ value: postIds.length }) },
      },
    })),
  };

  const postServiceMock = {
    getPostsByPostIds: jest.fn().mockResolvedValue(postsMock.items),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: ElasticsearchService, useValue: elasticsearchServiceMock },
        { provide: PostService, useValue: postServiceMock },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  describe('When searchTitleWithContent is called', () => {
    it('should search and return posts', async () => {
      const res = await service.searchTitleWithContent(
        { query: title, boardId, page },
        limit,
      );
      expect(res).toEqual(postsMock);
    });
  });

  describe('When searchTitle is called', () => {
    it('should search and return posts', async () => {
      const res = await service.searchTitle(
        { query: title, boardId, page },
        limit,
      );
      expect(res).toEqual(postsMock);
    });
  });

  describe('When searchUser is called', () => {
    it('should search and return posts', async () => {
      const res = await service.searchUser(
        { query: title, boardId, page },
        limit,
      );
      expect(res).toEqual(postsMock);
    });
  });
});
