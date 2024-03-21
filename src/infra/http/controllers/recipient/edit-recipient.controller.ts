import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/edit-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Put,
  HttpCode,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { RecipientAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/recipient-already-exists-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const editRecipientBodySchema = z.object({
  name: z.string(),
  street: z.string(),
  number: z.string(),
  city: z.string(),
  state: z.string(),
  cep: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

// pipe validation zod
const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

// type the variables editd in the zod object
type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@Controller('/recipients/:id')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') recipientId: string,
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, cep, city, latitude, longitude, number, state, street } = body
    const { sub: adminId } = user

    const result = await this.editRecipient.execute({
      adminId,
      recipientId,
      name,
      street,
      number,
      state,
      city,
      cep,
      latitude,
      longitude,
    })

    // if result does't exist
    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message) // 409
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message) // 400
      }
    }
  }
}
