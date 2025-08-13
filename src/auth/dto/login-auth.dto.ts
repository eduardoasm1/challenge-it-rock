import { User } from '../../user/entity/user.entity';
import { AuthDto } from './register-auth.dto';

export class LoginAuthDto extends AuthDto {}

export interface ILoginResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}
