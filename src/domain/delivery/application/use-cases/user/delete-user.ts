import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '../../repositories/user-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type DeleteUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    // finding the user by id
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    // delete a user
    await this.userRepository.delete(user)

    return right(null)
  }
}
