import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { EditDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/edit-delivery'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Put,
  HttpCode,
  Param,
  Body,
  NotFoundException,
  MethodNotAllowedException,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'

const editDeliveryBodySchema = z.object({
  recipientId: z.string().uuid(),
  deliverymanId: z.string().uuid(),
  title: z.string(),
})

// pipe validation zod
const bodyValidationPipe = new ZodValidationPipe(editDeliveryBodySchema)

// type the variables editd in the zod object
type EditDeliveryBodySchema = z.infer<typeof editDeliveryBodySchema>

@Controller('/deliveries/:id')
export class EditDeliveryController {
  constructor(private editDelivery: EditDeliveryUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') deliveryId: string,
    @Body(bodyValidationPipe) body: EditDeliveryBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, deliverymanId, recipientId } = body
    const { sub: adminId } = user

    const result = await this.editDelivery.execute({
      adminId,
      deliveryId,
      title,
      deliverymanId,
      recipientId,
    })

    // if result does't exist
    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message) // 400
      }
    }
  }
}
