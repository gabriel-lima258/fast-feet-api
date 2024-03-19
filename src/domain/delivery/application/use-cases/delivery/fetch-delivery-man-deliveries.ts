import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface FetchDeliveryManDeliveriesUseCaseRequest {
  deliveryManId: string
  page: number
}

type FetchDeliveryManDeliveriesUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    deliveries: Delivery[]
  }
>

@Injectable()
export class FetchDeliveryManDeliveriesUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private deliveryRepository: DeliveryRepository,
  ) {}

  async execute({
    deliveryManId,
    page,
  }: FetchDeliveryManDeliveriesUseCaseRequest): Promise<FetchDeliveryManDeliveriesUseCaseResponse> {
    const deliveryManExists =
      await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryManExists) {
      return left(new ResourceNotFoundError())
    }

    const deliveries = await this.deliveryRepository.findManyByDeliveryManId(
      deliveryManId,
      { page },
    )

    // retuning a list question deliveryman
    return right({
      deliveries,
    })
  }
}
