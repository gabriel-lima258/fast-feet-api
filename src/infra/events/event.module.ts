import { OnChangeStatus } from '@/domain/notification/application/subscribers/on-change-status'
import { DatabaseModule } from '../database/database.module'
import { Module } from '@nestjs/common'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule], // import question, answer repository in subscribers
  providers: [OnChangeStatus, SendNotificationUseCase],
})
export class EventsModule {}
