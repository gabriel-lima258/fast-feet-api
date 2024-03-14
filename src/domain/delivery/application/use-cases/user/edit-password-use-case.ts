import { Either, left, right } from '@/core/either'
import { User } from '@/domain/delivery/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { HashGenerator } from '../../cryptography/hash-generator'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

type UserRole = 'ADMIN' | 'DELIVERY-MAN'

interface EditUserUseCaseRequest {
  userId: string
  password: string
  role: UserRole
}

type EditUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User
  }
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    password,
    role,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    // finding the user by id
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (role !== user.role) {
      return left(new NotAllowedError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    if (user.password === hashedPassword) {
      return left(
        new Error('Try to use a password different from the old password'),
      )
    }

    user.password = hashedPassword

    // edit a user
    await this.userRepository.save(user)

    return right({
      user,
    })
  }
}
