import { Body, Controller, Post, Req } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IRefreshTokenDto } from './dto/refresh-token.dto';
import { FastifyRequest } from 'fastify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return await this.authService.register(registerAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Req() req: FastifyRequest) {
    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    return await this.authService.login(loginAuthDto, ip, userAgent);
  }

  @Post('refresh')
  async refreshAccessToken(
    @Body() payload: IRefreshTokenDto,
    @Req() req: FastifyRequest,
  ) {
    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    return await this.authService.refreshAccessToken(
      payload.refreshToken,
      ip,
      userAgent,
    );
  }
}
