import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryRepository } from '../../repositories/delivery-repository'

interface DeleteDeliveryUseCaseRequest {
  adminId: string
  deliveryId: string
}

type DeleteDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDeliveryUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryRepository: DeliveryRepository,
  ) {}

  async execute({
    adminId,
    deliveryId,
  }: DeleteDeliveryUseCaseRequest): Promise<DeleteDeliveryUseCaseResponse> {
    // finding the delivery by id
    const delivery = await this.deliveryRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    // delete a delivery
    await this.deliveryRepository.delete(delivery)

    return right(null)
  }
}
