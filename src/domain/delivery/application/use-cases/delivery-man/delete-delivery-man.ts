import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'

interface DeleteDeliveryManUseCaseRequest {
  adminId: string
  deliveryManId: string
}

type DeleteDeliveryManUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDeliveryManUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryManRepository: DeliveryManRepository,
  ) {}

  async execute({
    adminId,
    deliveryManId,
  }: DeleteDeliveryManUseCaseRequest): Promise<DeleteDeliveryManUseCaseResponse> {
    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    // finding the deliveryman by id
    const deliveryman = await this.deliveryManRepository.findById(deliveryManId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    // delete a deliveryman
    await this.deliveryManRepository.delete(deliveryman)

    return right(null)
  }
}
