import { Either, left, right } from '@/core/either'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AdminRepository } from '../../repositories/admin-repository'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface EditDeliveryManUseCaseRequest {
  adminId: string
  deliverymanId: string
  email: string
  cpf: string
  name?: string
  phone?: string
}

type EditDeliveryManUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | UserAlreadyExistsError,
  {
    deliveryman: DeliveryMan
  }
>

@Injectable()
export class EditDeliveryManUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliverymanRepository: DeliveryManRepository,
  ) {}

  async execute({
    adminId,
    deliverymanId,
    name,
    email,
    cpf,
    phone,
  }: EditDeliveryManUseCaseRequest): Promise<EditDeliveryManUseCaseResponse> {
    // finding the deliveryman by id
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new ResourceNotFoundError())
    }

    const deliverymanWithSameCPF =
      await this.deliverymanRepository.findByCPF(cpf)

    if (deliverymanWithSameCPF) {
      return left(new UserAlreadyExistsError())
    }

    deliveryman.name = name !== undefined ? name : deliveryman.name
    deliveryman.email = email
    deliveryman.cpf = cpf
    deliveryman.phone = phone !== undefined ? phone : deliveryman.phone

    // edit a deliveryman
    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
