import { Record } from '../../api/api.types';

export interface Comment extends Record {
  body: string;
  post_id: number;
  user_id: number;
}
