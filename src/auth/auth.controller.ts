import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IRefreshTokenDto } from './dto/refresh-token.dto';
import { FastifyRequest } from 'fastify';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return await this.authService.register(registerAuthDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Req() req: FastifyRequest) {
    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    const data = await this.authService.login(loginAuthDto, ip, userAgent);

    return {
      success: true,
      data,
    };
  }

  @Post('refresh')
  async refreshAccessToken(
    @Body() payload: IRefreshTokenDto,
    @Req() req: FastifyRequest,
  ) {
    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    const data = await this.authService.refreshAccessToken(
      payload.refreshToken,
      ip,
      userAgent,
    );

    return {
      success: true,
      data,
    };
  }
}
