import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Delivery } from '../entities/delivery'

export class ChangeStatusEvent implements DomainEvent {
  public ocurredAt: Date
  public delivery: Delivery
  public status: string

  constructor(delivery: Delivery, status: string) {
    this.ocurredAt = new Date()
    this.delivery = delivery
    this.status = status
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id
  }
}
