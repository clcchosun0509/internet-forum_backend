import { User } from "./entities";
import { Request } from 'express';

export type Done = (err: Error, user: User) => void;

export interface AuthenticatedRequest extends Request {
  user: User;
}