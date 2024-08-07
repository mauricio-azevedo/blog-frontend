import { Pagination, Record } from '../../api/api.types';
import { User } from '../users/users.types';
import { Comment } from '../comments/comments.types';

export interface Post extends Record {
  title: string;
  body: string;
  user_id: number;
  user: User;
  comments: Comment[];
}

export interface PostsPaginated {
  posts: Post[];
  pagination: Pagination;
}
