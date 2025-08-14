import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const apiKeyHeader = request.raw.headers['x-api-key'] as string;

    const validApiKey = this.configService.get<string>(
      'JSON_PLACEHOLDER_API_KEY',
    );

    if (!validApiKey) {
      throw new UnauthorizedException('API Key not configured by the server.');
    }

    if (apiKeyHeader !== validApiKey) {
      throw new UnauthorizedException('Invalid or missing API Key.');
    }

    return true;
  }
}
