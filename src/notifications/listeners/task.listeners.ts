import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TASK_EVENTS, TaskEventPayload } from 'src/task/events/task.event';

@Injectable()
export class TaskListener {
  private readonly logger = new Logger(TaskListener.name);

  @OnEvent(TASK_EVENTS.CREATED)
  handleTaskCreatedEvent(payload: TaskEventPayload) {
    this.logger.log(
      `Nueva tarea creada. Título: "${payload.task.title}", ID: ${payload.task.id}`,
    );
  }

  @OnEvent(TASK_EVENTS.COMPLETED, { async: true })
  handleTaskCompletedEvent(payload: TaskEventPayload) {
    this.logger.log(
      `Tarea completada Título: "${payload.task.title}", ID: ${payload.task.id}`,
    );
  }
}
