import { IsIn, IsOptional, IsString, IsBoolean } from 'class-validator';
import { TaskPriority } from '../dto/task.dto';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsOptional()
  @IsIn([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
  priority?: TaskPriority;
}
