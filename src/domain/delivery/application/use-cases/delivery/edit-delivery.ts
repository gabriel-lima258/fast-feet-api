import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { RecipientRepository } from '../../repositories/recipient-repository'

interface EditDeliveryUseCaseRequest {
  adminId: string
  recipientId: string
  deliverymanId: string
  deliveryId: string
  title: string
}

type EditDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    delivery: Delivery
  }
>

@Injectable()
export class EditDeliveryUseCase {
  constructor(
    private deliverysRepository: DeliveryRepository,
    private administratorsRepository: AdminRepository,
    private deliverymansRepository: DeliveryManRepository,
    private recipientsRepository: RecipientRepository,
  ) {}

  async execute({
    adminId,
    deliverymanId,
    deliveryId,
    recipientId,
    title,
  }: EditDeliveryUseCaseRequest): Promise<EditDeliveryUseCaseResponse> {
    const delivery = await this.deliverysRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    const administrator = await this.administratorsRepository.findById(adminId)

    if (!administrator) {
      return left(new NotAllowedError())
    }

    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    delivery.title = title
    delivery.deliveryManId = deliveryman.id
    delivery.recipientId = recipient.id

    await this.deliverysRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
