import { Test, TestingModule } from '@nestjs/testing';
import { BoardId } from '../entities/board-id.type';
import { postsStub } from '../post/post.mock';
import { PostService } from '../post/post.service';
import { BoardController } from './board.controller';

describe('BoardController', () => {
  let controller: BoardController;
  let fakePostService: Partial<PostService>;

  beforeEach(async () => {
    fakePostService = {
      getPostsByBoardId: jest.fn(
        (page: number, limit: number, boardId: BoardId) => {
          return Promise.resolve(postsStub(limit, boardId));
        },
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PostService, useValue: fakePostService }],
      controllers: [BoardController],
    }).compile();

    controller = module.get<BoardController>(BoardController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a paginated list of posts', async () => {
    const page = 1;
    const id = BoardId.Hahaha;
    const result = await controller.getPosts(id, page);
    expect(fakePostService.getPostsByBoardId).toHaveBeenCalledWith(
      page,
      30,
      id,
    );
    expect(result).toEqual(postsStub(30, id));
  });
});
