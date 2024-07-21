import { Record } from '../../api/api.types';
import { User } from '../users/users.types';

export interface Comment extends Record {
  body: string;
  user: User;
  post_id: number;
  user_id: number;
}
