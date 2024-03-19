import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { RecipientRepository } from '../../repositories/recipient-repository'

interface CreateDeliveryUseCaseRequest {
  adminId: string
  recipientId: string
  deliverymanId: string
  title: string
}

type CreateDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    delivery: Delivery
  }
>

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    private deliverysRepository: DeliveryRepository,
    private administratorsRepository: AdminRepository,
    private deliverymansRepository: DeliveryManRepository,
    private recipientsRepository: RecipientRepository,
  ) {}

  async execute({
    adminId,
    deliverymanId,
    recipientId,
    title,
  }: CreateDeliveryUseCaseRequest): Promise<CreateDeliveryUseCaseResponse> {
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

    const delivery = Delivery.create({
      deliveryManId: deliveryman.id,
      recipientId: recipient.id,
      title,
    })

    await this.deliverysRepository.create(delivery)

    return right({
      delivery,
    })
  }
}
