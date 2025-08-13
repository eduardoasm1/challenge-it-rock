import {
  IsOptional,
  IsIn,
  IsBooleanString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority } from '../dto/task.dto';

export class FilterTaskDto {
  @IsOptional()
  @IsIn([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
  priority?: TaskPriority;

  @IsOptional()
  @IsBooleanString()
  completed?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
