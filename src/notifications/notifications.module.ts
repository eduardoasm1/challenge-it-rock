import { Module, Logger } from '@nestjs/common';
import { TaskListener } from './listeners/task.listeners';

@Module({
  providers: [TaskListener, Logger],
})
export class NotificationsModule {}
