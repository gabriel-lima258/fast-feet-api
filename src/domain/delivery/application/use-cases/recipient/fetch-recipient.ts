import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { RecipientRepository } from '../../repositories/recipient-repository'

interface FetchRecipientUseCaseRequest {
  adminId: string
  page: number
}

type FetchRecipientUseCaseResponse = Either<
  NotAllowedError,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class FetchRecipientUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchRecipientUseCaseRequest): Promise<FetchRecipientUseCaseResponse> {
    const adminExists = await this.adminRepository.findById(adminId)

    if (!adminExists) {
      return left(new NotAllowedError())
    }

    const recipients = await this.recipientRepository.findMany({ page })

    // retuning a list question recipients
    return right({
      recipients,
    })
  }
}
