import { User } from '../users/users.types';

export interface SignResponse {
  user: User;
  access_token: string;
}
