import { Either, left, right } from '@/core/either'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../cryptography/hash-generator'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'
import { AdminRepository } from '../../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface CreateDeliveryManUseCaseRequest {
  adminId: string
  name: string
  email: string
  cpf: string
  phone: string
  password: string
}

type CreateDeliveryManUseCaseResponse = Either<
  NotAllowedError | UserAlreadyExistsError,
  {
    deliveryMan: DeliveryMan
  }
>

@Injectable()
export class CreateDeliveryManUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    name,
    email,
    cpf,
    phone,
    password,
  }: CreateDeliveryManUseCaseRequest): Promise<CreateDeliveryManUseCaseResponse> {
    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    const deliveryManWithSameCPF =
      await this.deliveryManRepository.findByCPF(cpf)

    if (deliveryManWithSameCPF) {
      return left(new UserAlreadyExistsError())
    }

    // hash the password
    const hashedPassword = await this.hashGenerator.hash(password)

    // create the DeliveryMan
    const deliveryMan = DeliveryMan.create({
      name,
      email,
      cpf,
      phone,
      password: hashedPassword,
    })

    // set the deliveryMan in repository
    await this.deliveryManRepository.create(deliveryMan)

    return right({
      deliveryMan,
    })
  }
}
