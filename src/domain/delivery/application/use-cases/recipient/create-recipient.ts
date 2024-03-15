import { Either, right } from '@/core/either'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { RecipientRepository } from '../../repositories/recipient-repository'

interface CreateRecipientUseCaseRequest {
  name: string
  email: string
  address: string
  city: string
  state: string
  cep: string
}

type CreateRecipientUseCaseResponse = Either<
  null,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    email,
    address,
    city,
    state,
    cep,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    // create the Recipient
    const recipient = Recipient.create({
      name,
      email,
      address,
      city,
      state,
      cep,
    })

    // set the recipient in repository
    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
