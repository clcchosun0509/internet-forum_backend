import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Comment } from "../../entities";
import { User, UserRole } from "../../entities/user.entity";

export const checkIsValidAndAuthorized = (comment: Comment, user: User) => {
  if (!comment) {
    throw new BadRequestException('존재하지 않는 댓글 입니다.');
  }

  const isAdmin = user.roles.includes(UserRole.ADMIN);
  if (!isAdmin && user.id !== comment.authorId) {
    throw new UnauthorizedException('댓글 작성자가 아닙니다.');
  }
}