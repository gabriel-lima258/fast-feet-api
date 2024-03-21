import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CreateRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/create-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Post,
  HttpCode,
  Body,
  MethodNotAllowedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { RecipientAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/recipient-already-exists-error'

const createRecipientBodySchema = z.object({
  name: z.string(),
  street: z.string(),
  number: z.string(),
  city: z.string(),
  state: z.string(),
  cep: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateRecipientBodySchema,
  ) {
    const { sub: adminId } = user
    const { name, street, state, number, cep, city, latitude, longitude } = body

    const result = await this.createRecipient.execute({
      adminId,
      name,
      street,
      state,
      number,
      cep,
      city,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message) // 409
        default:
          throw new BadRequestException(error.message) // 400
      }
    }
  }
}
