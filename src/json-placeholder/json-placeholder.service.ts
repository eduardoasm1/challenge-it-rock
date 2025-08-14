import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ExternalTodo } from './dto/json-placeholder.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JsonPlaceholderService {
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>(
      'JSON_PLACEHOLDER_BASE_API_URL',
    )!;
  }

  async fetchTodos(): Promise<ExternalTodo[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ExternalTodo[]>(`${this.apiUrl}/todos`),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching data from JSONPlaceholder:', error);
      throw new Error('Could not fetch data from external API.');
    }
  }
}
