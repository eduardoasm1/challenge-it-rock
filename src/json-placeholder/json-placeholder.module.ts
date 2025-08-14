import { Module } from '@nestjs/common';
import { JsonPlaceholderService } from './json-placeholder.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [JsonPlaceholderService],
})
export class JsonPlaceholderModule {}
