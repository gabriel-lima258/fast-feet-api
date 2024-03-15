import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { RecipientRepository } from '../../repositories/recipient-repository'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    // finding the recipient by id
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    // delete a recipient
    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
