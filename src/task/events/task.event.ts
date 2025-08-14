import { Task } from '../entity/task.entity';

export const TASK_EVENTS = {
  CREATED: 'task.created',
  COMPLETED: 'task.completed',
} as const;

export interface TaskEventPayload {
  task: Task;
}
