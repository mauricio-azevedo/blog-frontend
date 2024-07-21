import { Record } from '../../api/api.types';

export interface User extends Record {
  name: string;
  email: string;
}
