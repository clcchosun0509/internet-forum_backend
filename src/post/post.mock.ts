import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Post } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { userStub } from '../user/user.mock';

export const postStub: (postId: number, boardId: BoardId) => Post = (postId, boardId) => {
  return {
    id: postId,
    title: `title ${postId}`,
    authorId: `author ${postId}`,
    author: userStub(),
    content: `<p>content ${postId}</p>`,
    boardId,
    viewCount: 0,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    deletedAt: null,
  }
}

export const postsStub: (
  limit: number,
  boardId: BoardId,
) => Pagination<Post, IPaginationMeta> = (limit, boardId) => {
  return {
    items: [
      postStub(1, boardId),
      postStub(2, boardId),
    ],
    meta: {
      itemCount: 2,
      totalItems: 2,
      itemsPerPage: limit,
      totalPages: 1,
      currentPage: 1,
    },
  };
};
