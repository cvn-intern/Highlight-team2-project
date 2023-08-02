import { User } from '../../user/user.entity';

export type UserToken = {
  user: User;
  accessToken: string;
};
