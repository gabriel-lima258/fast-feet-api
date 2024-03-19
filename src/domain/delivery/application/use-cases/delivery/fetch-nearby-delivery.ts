import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface FetchNearbyDeliveryUseCaseRequest {
  userLatitude: number
  userLongitude: number
  deliveryManId: string
  page: number
}

type FetchNearbyDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    deliveries: Delivery[]
  }
>

@Injectable()
export class FetchNearbyDeliveryUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private deliveryRepository: DeliveryRepository,
  ) {}

  async execute({
    userLatitude,
    userLongitude,
    deliveryManId,
    page,
  }: FetchNearbyDeliveryUseCaseRequest): Promise<FetchNearbyDeliveryUseCaseResponse> {
    const deliveryManExists =
      await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryManExists) {
      return left(new ResourceNotFoundError())
    }

    const deliveries =
      await this.deliveryRepository.findManyByDeliveryManAndNearby(
        deliveryManId,
        { page, latitude: userLatitude, longitude: userLongitude },
      )

    // retuning a list question deliveryman
    return right({
      deliveries,
    })
  }
}
