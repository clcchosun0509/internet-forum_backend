import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Post } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { PostLike } from '../entities/post-like.entity';
import { userStub } from '../user/user.mock';

export const postLikeStub = (
  postId: number,
  boardId: BoardId,
  userId: string,
): PostLike => {
  return {
    postId,
    post: postStub(postId, boardId),
    userId,
    user: userStub(userId),
    createdAt: new Date('2023-01-01'),
  };
};

export const postStub = (postId: number, boardId: BoardId, title?: string): Post => {
  return {
    id: postId,
    title: title ? title : `title ${postId}`,
    authorId: `author ${postId}`,
    author: userStub(`author ${postId}`),
    content: `<p>content ${postId}</p>`,
    boardId,
    viewCount: 0,
    likeCount: 0,
    likes: [],
    comments: [],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    deletedAt: null,
  };
};

export const postsStub: (
  limit: number,
  boardId: BoardId,
  posts?: [Post, Post]
) => Pagination<Post, IPaginationMeta> = (limit, boardId, posts) => {
  return {
    items: posts ? posts : [postStub(1, boardId), postStub(2, boardId)],
    meta: {
      itemCount: 2,
      totalItems: 2,
      itemsPerPage: limit,
      totalPages: 1,
      currentPage: 1,
    },
  };
};
