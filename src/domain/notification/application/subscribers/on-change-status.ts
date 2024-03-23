import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'
import { ChangeStatusEvent } from '@/domain/delivery/enterprise/events/change-status-event'
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'

@Injectable()
export class OnChangeStatus implements EventHandler {
  // use question repository to link to answer
  constructor(
    private sendNotification: SendNotificationUseCase,
    private recipientRepository: RecipientRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendChangeStatusNotification.bind(this),
      ChangeStatusEvent.name,
    )
  }

  private async sendChangeStatusNotification({
    delivery,
    status,
  }: ChangeStatusEvent) {
    const recipient = await this.recipientRepository.findById(
      delivery.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Status of your delivery was changed!',
        content: `Your delivery is "${status}" now.`,
      })
    }
  }
}
