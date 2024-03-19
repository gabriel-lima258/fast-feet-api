import {
  DeliveryRepository,
  FindManyNearbyParams,
} from '@/domain/delivery/application/repositories/delivery-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { InMemoryDeliveryAttachmentsRepository } from './in-memory-delivery-attachments-repository'
import { InMemoryRecipientRepository } from './in-memory-recipient-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { getDistanceBetweenCoordinater } from '@/core/utils/get-distance-between-coordinates'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryDeliveryRepository implements DeliveryRepository {
  public items: Delivery[] = []

  // attachement repository, inmemory repositories to use in value object
  constructor(
    private deliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository,
    private recipientRepository: InMemoryRecipientRepository,
  ) {}

  async create(delivery: Delivery) {
    this.items.push(delivery)

    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async delete(delivery: Delivery) {
    const itemIndex = this.items.findIndex((item) => item.id === delivery.id)

    // splice remove an item from array
    this.items.splice(itemIndex, 1)

    // delete all attachments
    this.deliveryAttachmentsRepository.deleteManyByDeliveryId(
      delivery.id.toString(),
    )
  }

  async save(delivery: Delivery) {
    const itemIndex = this.items.findIndex((item) => item.id === delivery.id)

    // replace an item from another delivery
    this.items[itemIndex] = delivery

    if (
      delivery.status === 'Delivered' &&
      delivery.attachments !== null &&
      delivery.attachments !== undefined
    ) {
      await this.deliveryAttachmentsRepository.createMany(
        delivery.attachments.getItems(),
      )
    }
    DomainEvents.dispatchEventsForAggregate(delivery.id)
  }

  async findById(id: string) {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async findMany({ page }: PaginationParams) {
    const delivery = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return delivery
  }

  async findManyByDeliveryManId(id: string, { page }: PaginationParams) {
    const delivery = this.items
      .filter((item) => item.deliveryManId.toString() === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return delivery
  }

  async findManyByDeliveryManAndNearby(
    id: string,
    params: FindManyNearbyParams,
  ) {
    const delivery = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
      .filter((delivery) => {
        const recipient = this.recipientRepository.items.find((recipient) => {
          return recipient.id.equals(delivery.recipientId)
        })

        if (!recipient) {
          throw new Error(
            `Recipient with Id ${delivery.recipientId.toString()} does not exist.`,
          )
        }

        const distance = getDistanceBetweenCoordinater(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: recipient.latitude,
            longitude: recipient.longitude,
          },
        )

        if (!delivery.deliveryManId === null) {
          throw new Error(
            `Deliveryman with ID "${delivery.deliveryManId.toString()}" does not exist`,
          )
        }

        return distance < 10 && delivery.deliveryManId.toString() === id
      })

    return delivery
  }
}
