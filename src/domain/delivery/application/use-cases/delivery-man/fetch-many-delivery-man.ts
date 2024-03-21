import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface FetchDeliveryManUseCaseRequest {
  adminId: string
  page: number
}

type FetchDeliveryManUseCaseResponse = Either<
  NotAllowedError,
  {
    deliverymans: DeliveryMan[]
  }
>

@Injectable()
export class FetchDeliveryManUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliverymanRepository: DeliveryManRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchDeliveryManUseCaseRequest): Promise<FetchDeliveryManUseCaseResponse> {
    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    const deliverymans = await this.deliverymanRepository.findMany({ page })

    // retuning a list question deliveryman
    return right({
      deliverymans,
    })
  }
}
