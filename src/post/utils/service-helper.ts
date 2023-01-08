import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Post } from "../../entities";
import { User, UserRole } from "../../entities/user.entity";

export const checkIsValidAndAuthorized = (post: Post, user: User) => {
  if (!post) {
    throw new BadRequestException('존재하지 않는 게시물 입니다.');
  }

  const isAdmin = user.roles.includes(UserRole.ADMIN);
  if (!isAdmin && user.id !== post.authorId) {
    throw new UnauthorizedException('게시글 작성자가 아닙니다.');
  }
}