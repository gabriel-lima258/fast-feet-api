import { Either, left, right } from '@/core/either'
import { UserAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-already-exists-error'
import { User } from '@/domain/delivery/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { HashGenerator } from '../../cryptography/hash-generator'

type UserRole = 'ADMIN' | 'DELIVERY-MAN'

interface RegisterUserUseCaseRequest {
  name: string
  cpf: string
  password: string
  role: UserRole
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    role,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByCPF(cpf)

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError())
    }

    // hash the password
    const hashedPassword = await this.hashGenerator.hash(password)

    // create the User
    const user = User.create({
      name,
      cpf,
      password: hashedPassword,
      role,
    })

    // set the user in repository
    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
