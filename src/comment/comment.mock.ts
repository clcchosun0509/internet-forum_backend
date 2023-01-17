import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Comment } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { postStub } from '../post/post.mock';
import { userStub } from '../user/user.mock';

export const commentStub = (commentId: string, postId: number, parentCommentId?: string): Comment => {
  return {
    id: commentId,
    content: 'content',
    postId,
    post: postStub(postId, BoardId.Free),
    authorId: `author ${postId}`,
    author: userStub(`author ${postId}`),
    parentCommentId: parentCommentId ? parentCommentId : null,
    parentComment: null,
    childComments: null,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    deletedAt: null,
  };
};

export const commentsStub: (
  limit: number,
  postId: number,
) => Pagination<Comment, IPaginationMeta> = (limit, postId) => {
  return {
    items: [commentStub('comment 1', postId), commentStub('comment 2', postId)],
    meta: {
      itemCount: 2,
      totalItems: 2,
      itemsPerPage: limit,
      totalPages: 1,
      currentPage: 1,
    },
  };
};
