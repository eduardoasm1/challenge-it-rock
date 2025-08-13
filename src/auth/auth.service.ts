import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare, hash, genSalt } from 'bcrypt';
import { ILoginResponseDto, LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/refresh-token/entity/refres-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly rtRepo: Repository<RefreshToken>,
  ) {}

  private signAccessToken(userId: string, userName: string, roles: string[]) {
    return this.jwtService.sign(
      { id: userId, userName, roles },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRES_IN'),
      },
    );
  }

  private signRefreshToken(userId: string) {
    return this.jwtService.sign(
      { id: userId, tokenType: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_SECRET_EXPIRES_IN',
        ),
      },
    );
  }

  private async saveRefreshToken(
    user: User,
    refreshToken: string,
    ip: string,
    userAgent: string,
  ) {
    const decoded: any = this.jwtService.decode(refreshToken);

    const salt = await genSalt(10);
    const hashed = await hash(refreshToken, salt);

    const entity = this.rtRepo.create({
      user,
      hashedToken: hashed,
      expiresAt: new Date(decoded.exp * 1000),
      ipAddress: ip,
      userAgent,
    });

    await this.rtRepo.save(entity);
  }

  async register(registerUser: RegisterAuthDto): Promise<User> {
    const { userName, password } = registerUser;
    const userExists = await this.userService.findOne({ userName });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const plainToHash = await hash(password, 10);

    registerUser.password = plainToHash;

    return this.userService.create(registerUser);
  }

  async login(
    loginUser: LoginAuthDto,
    ip: string,
    userAgent: string,
  ): Promise<ILoginResponseDto> {
    const { userName, password } = loginUser;
    const user = await this.userService.findOne({ userName });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    await this.rtRepo.delete({ user: { id: user.id }, userAgent });

    const accessToken = this.signAccessToken(
      user.id,
      user.userName,
      user.roles,
    );

    const refreshToken = this.signRefreshToken(user.id);

    await this.saveRefreshToken(user, refreshToken, ip, userAgent);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
    ip: string,
    userAgent: string,
  ) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findOne({ id: payload.id });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      const storedTokens = await this.rtRepo.find({
        where: { user: { id: user.id }, isRevoked: false },
      });

      let validToken: RefreshToken | null = null;
      for (const stored of storedTokens) {
        const match = await compare(refreshToken, stored.hashedToken);
        if (match) {
          validToken = stored;
          break;
        }
      }

      if (!validToken || validToken.expiresAt < new Date()) {
        throw new HttpException(
          'Invalid or expired refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.rtRepo.delete({ user: { id: user.id }, userAgent });

      const newAccessToken = this.signAccessToken(
        user.id,
        user.userName,
        user.roles,
      );

      const newRefreshToken = this.signRefreshToken(user.id);
      validToken.isRevoked = true;
      await this.rtRepo.save(validToken);
      await this.saveRefreshToken(user, newRefreshToken, ip, userAgent);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error('Error on refresh access token:', error);
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
