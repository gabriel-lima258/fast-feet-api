import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-compare'
import { DeliveryManRepository } from '../../repositories/delivery-man-repository'

interface AuthenticateDeliveryManUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliveryManUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliveryManUseCaseRequest): Promise<AuthenticateDeliveryManUseCaseResponse> {
    const deliveryMan = await this.deliveryManRepository.findByCPF(cpf)

    // if don't find deliveryMan
    if (!deliveryMan) {
      return left(new WrongCredentialsError())
    }

    // compare hashed password
    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryMan.password,
    )

    // if password is incorrect
    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    // create the access token
    const accessToken = await this.encrypter.encrypt({
      sub: deliveryMan.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
