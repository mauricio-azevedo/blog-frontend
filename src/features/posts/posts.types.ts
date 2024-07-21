import { Record } from '../../api/api.types';
import { User } from '../users/users.types';
import { Comment } from '../comments/comments.types';

export interface Post extends Record {
  title: string;
  body: string;
  user: User;
  comments: Comment;
}
