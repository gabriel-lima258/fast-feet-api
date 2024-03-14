import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-compare'
import { UserRepository } from '../../repositories/user-repository'

interface AuthenticateUserUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByCPF(cpf)

    // if don't find user
    if (!user) {
      return left(new WrongCredentialsError())
    }

    // compare hashed password
    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    // if password is incorrect
    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    // create the access token
    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
