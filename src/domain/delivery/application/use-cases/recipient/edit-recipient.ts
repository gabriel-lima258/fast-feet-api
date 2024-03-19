import { Either, left, right } from '@/core/either'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AdminRepository } from '../../repositories/admin-repository'
import { RecipientRepository } from '../../repositories/recipient-repository'
import { RecipientAlreadyExistsError } from '../errors/recipient-already-exists-error'

interface EditRecipientUseCaseRequest {
  adminId: string
  recipientId: string
  name: string
  street: string
  number: string
  city: string
  state: string
  cep: string
  latitude: number
  longitude: number
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    adminId,
    recipientId,
    name,
    street,
    number,
    city,
    state,
    cep,
    latitude,
    longitude,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    // finding the recipient by id
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    const recipientWithSameCep = await this.recipientRepository.findByCep(cep)

    if (recipientWithSameCep) {
      return left(new RecipientAlreadyExistsError())
    }

    recipient.name = name
    recipient.street = street
    recipient.number = number
    recipient.city = city
    recipient.state = state
    recipient.cep = cep
    recipient.latitude = latitude
    recipient.longitude = longitude

    // edit a recipient
    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
