import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RecipientRepository } from '../../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

interface GetRecipientByEmailUseCaseRequest {
  cep: string
}

type GetRecipientByEmailUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientByEmailUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    cep,
  }: GetRecipientByEmailUseCaseRequest): Promise<GetRecipientByEmailUseCaseResponse> {
    const recipient = await this.recipientRepository.findByCep(cep)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({
      recipient,
    })
  }
}
