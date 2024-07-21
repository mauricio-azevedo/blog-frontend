import { Record } from '../../api/api.types';

export interface User extends Record {
  name: string;
  email: string;
  user_id: number;
}
