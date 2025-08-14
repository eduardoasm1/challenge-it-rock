import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './entity/task.entity';
import { JsonPlaceholderModule } from 'src/json-placeholder/json-placeholder.module';
import { AuthModule } from 'src/auth/auth.module';
import { JsonPlaceholderService } from 'src/json-placeholder/json-placeholder.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    JsonPlaceholderModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, JsonPlaceholderService],
})
export class TasksModule {}
