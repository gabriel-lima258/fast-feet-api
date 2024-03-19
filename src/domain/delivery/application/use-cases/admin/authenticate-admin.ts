import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-compare'
import { AdminRepository } from '../../repositories/admin-repository'

interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByCPF(cpf)

    // if don't find admin
    if (!admin) {
      return left(new WrongCredentialsError())
    }

    // compare hashed password
    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    )

    // if password is incorrect
    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    // create the access token
    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
