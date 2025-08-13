import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { Task } from './entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    // AuthModule // Asegúrate de que AuthModule esté disponible para el guard
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
