import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../cryptography/hash-generator'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'

interface ChangePasswordDeliverymanUseCaseRequest {
  adminId: string
  deliverymanId: string
  password: string
  confirmPassword: string
}

type ChangePasswordDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | WrongCredentialsError,
  {
    deliveryman: DeliveryMan
  }
>

@Injectable()
export class ChangePasswordDeliverymanUseCase {
  constructor(
    private administratorsRepository: AdminRepository,
    private deliverymansRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    deliverymanId,
    password,
    confirmPassword,
  }: ChangePasswordDeliverymanUseCaseRequest): Promise<ChangePasswordDeliverymanUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const adminExists = await this.administratorsRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    if (password !== confirmPassword) {
      return left(new WrongCredentialsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    deliveryman.password = hashedPassword

    await this.deliverymansRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
