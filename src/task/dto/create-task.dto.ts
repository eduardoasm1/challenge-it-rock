import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority } from '../dto/task.dto';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsIn([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
  priority: TaskPriority;
}
