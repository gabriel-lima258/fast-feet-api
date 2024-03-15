import { Either, left, right } from '@/core/either'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { RecipientRepository } from '../../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  email: string
  address: string
  city: string
  state: string
  cep: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
    name,
    email,
    address,
    city,
    state,
    cep,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    // finding the recipient by id
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== recipient.id.toString()) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    recipient.email = email
    recipient.address = address
    recipient.city = city
    recipient.state = state
    recipient.cep = cep

    // edit a recipient
    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
