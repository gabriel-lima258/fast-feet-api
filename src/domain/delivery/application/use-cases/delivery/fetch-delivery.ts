import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeliveryRepository } from '../../repositories/delivery-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

interface FetchDeliveryUseCaseRequest {
  adminId: string
  page: number
}

type FetchDeliveryUseCaseResponse = Either<
  NotAllowedError,
  {
    deliveries: Delivery[]
  }
>

@Injectable()
export class FetchDeliveryUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryRepository: DeliveryRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchDeliveryUseCaseRequest): Promise<FetchDeliveryUseCaseResponse> {
    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    const deliveries = await this.deliveryRepository.findMany({ page })

    // retuning a list question deliveryman
    return right({
      deliveries,
    })
  }
}
