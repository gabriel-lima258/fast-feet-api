import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

interface DeliveryAvailableUseCaseRequest {
  adminId: string
  deliveryId: string
}

type DeliveryAvailableUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    delivery: Delivery
  }
>

@Injectable()
export class DeliveryAvailableUseCase {
  constructor(
    private administratorsRepository: AdminRepository,
    private deliverysRepository: DeliveryRepository,
  ) {}

  async execute({
    adminId,
    deliveryId,
  }: DeliveryAvailableUseCaseRequest): Promise<DeliveryAvailableUseCaseResponse> {
    const administrator = await this.administratorsRepository.findById(adminId)

    if (!administrator) {
      return left(new NotAllowedError())
    }

    const delivery = await this.deliverysRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    delivery.status = 'Waiting'
    delivery.postedAt = new Date()

    await this.deliverysRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
