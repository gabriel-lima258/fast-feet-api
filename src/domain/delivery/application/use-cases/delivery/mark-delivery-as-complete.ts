import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { DeliveryAttachment } from '@/domain/delivery/enterprise/entities/delivery-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryAttachmentList } from '@/domain/delivery/enterprise/entities/delivery-attachment-list'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

interface MarkDeliveryAsCompletedUseCaseRequest {
  deliveryManId: string
  attachmentIds: string[]
  deliveryId: string
}

type MarkDeliveryAsCompletedUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    delivery: Delivery
  }
>

@Injectable()
export class MarkDeliveryAsCompletedUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private deliverysRepository: DeliveryRepository,
  ) {}

  async execute({
    deliveryManId,
    attachmentIds,
    deliveryId,
  }: MarkDeliveryAsCompletedUseCaseRequest): Promise<MarkDeliveryAsCompletedUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new NotAllowedError())
    }

    const delivery = await this.deliverysRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (deliveryManId !== delivery.deliveryManId.toString()) {
      return left(new NotAllowedError())
    }

    const deliveryAttachments = attachmentIds.map((attachmentId) => {
      return DeliveryAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        deliveryId: delivery.id,
      })
    })

    delivery.attachments = new DeliveryAttachmentList(deliveryAttachments)
    delivery.status = 'Delivered'
    delivery.deliveredAt = new Date()

    await this.deliverysRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
