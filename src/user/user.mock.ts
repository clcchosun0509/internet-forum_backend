import { User, UserRole } from "../entities/user.entity";

export const userStub = (id?: string): User => {
  return {
    id: id ? id : 'test',
    email: 'test@test.com',
    username: 'test_username',
    avatar: 'http://test.com/test.jpg',
    roles: [UserRole.USER],
    posts: [],
    postLikes: [],
    comments: [],
    createdAt: new Date('2022-12-10'),
    updatedAt: new Date('2022-12-10'),
    deletedAt: null,
  };
};
