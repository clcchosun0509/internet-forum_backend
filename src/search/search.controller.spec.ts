import { Test, TestingModule } from '@nestjs/testing';
import { BoardId } from '../entities/board-id.type';
import { postsStub, postStub } from '../post/post.mock';
import { SearchQueryDto } from './dtos/search-post-query.dto';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let controller: SearchController;
  const title = 'test title';
  const boardId = BoardId.Free;
  const page = 1;
  const limit = 10;
  const postsMock = postsStub(limit, boardId, [
    postStub(1, boardId, title),
    postStub(2, boardId, title),
  ]);

  const searchMock = (dto: SearchQueryDto, limit: number) => {
    if (
      dto.boardId === boardId &&
      dto.page === page &&
      dto.query === title &&
      limit === limit
    ) {
      return postsMock;
    }
  };

  const searchServiceMock = {
    searchTitleWithContent: searchMock,
    searchTitle: searchMock,
    searchUser: searchMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: SearchService, useValue: searchServiceMock }],
      controllers: [SearchController],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When searchTitleWithContent is called', () => {
    it('should search title with content', async () => {
      const res = await controller.searchTitleWithContent({
        query: title,
        boardId,
        page,
      });
      expect(res).toEqual(postsMock);
    });
  });

  describe('When searchTitle is called', () => {
    it('should search title', async () => {
      const res = await controller.searchTitle({
        query: title,
        boardId,
        page,
      });
      expect(res).toEqual(postsMock);
    });
  });

  describe('When searchUser is called', () => {
    it('should search user', async () => {
      const res = await controller.searchUser({
        query: title,
        boardId,
        page,
      });
      expect(res).toEqual(postsMock);
    });
  });
});
