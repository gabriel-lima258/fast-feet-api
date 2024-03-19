import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

interface MarkPickedUpDeliveryUseCaseRequest {
  deliveryManId: string
  deliveryId: string
}

type MarkPickedUpDeliveryUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    delivery: Delivery
  }
>

@Injectable()
export class MarkPickedUpDeliveryUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private deliverysRepository: DeliveryRepository,
  ) {}

  async execute({
    deliveryManId,
    deliveryId,
  }: MarkPickedUpDeliveryUseCaseRequest): Promise<MarkPickedUpDeliveryUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryMan) {
      return left(new NotAllowedError())
    }

    const delivery = await this.deliverysRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    delivery.status = 'Picked up'
    delivery.pickedUpAt = new Date()

    await this.deliverysRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
