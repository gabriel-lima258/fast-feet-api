import { Either, left, right } from '@/core/either'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { RecipientRepository } from '../../repositories/recipient-repository'
import { RecipientAlreadyExistsError } from '../errors/recipient-already-exists-error'

interface CreateRecipientUseCaseRequest {
  adminId: string
  name: string
  street: string
  number: string
  city: string
  state: string
  cep: string
  latitude: number
  longitude: number
}

type CreateRecipientUseCaseResponse = Either<
  NotAllowedError | RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    adminId,
    name,
    street,
    number,
    city,
    state,
    cep,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipientWithSameCep = await this.recipientRepository.findByCep(cep)

    if (recipientWithSameCep) {
      return left(new RecipientAlreadyExistsError())
    }

    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    // create the Recipient
    const recipient = Recipient.create({
      name,
      street,
      number,
      city,
      state,
      cep,
      latitude,
      longitude,
    })

    // set the recipient in repository
    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
