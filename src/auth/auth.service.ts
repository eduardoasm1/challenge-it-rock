import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare, hash } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtAuthService: JwtService,
    // private readonly jwtService: JwtService,
  ) {}

  async register(registerUser: RegisterAuthDto) {
    const { userName, password } = registerUser;
    const userExists = await this.userService.findOne({ userName });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const plainToHash = await hash(password, 10);

    registerUser.password = plainToHash;

    return this.userService.create(registerUser);
  }

  async login(loginUser: LoginAuthDto) {
    const { userName, password } = loginUser;
    const user = await this.userService.findOne({ userName });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const payload = { id: user.id, userName: user.userName };

    const token = this.jwtAuthService.sign(payload);

    return {
      user,
      token,
    };
  }
}
