import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { RecipientRepository } from '../../repositories/recipient-repository'

interface DeleteRecipientUseCaseRequest {
  adminId: string
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    adminId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

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
