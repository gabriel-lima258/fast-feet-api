import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { MarkDeliveryAsCompletedUseCase } from '@/domain/delivery/application/use-cases/delivery/mark-delivery-as-complete'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Patch,
  HttpCode,
  Param,
  NotFoundException,
  MethodNotAllowedException,
  BadRequestException,
  Body,
} from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { z } from 'zod'

const markDeliveryDeliveredBodySchema = z.object({
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(
  markDeliveryDeliveredBodySchema,
)

type MarkDeliveryDeliveredBodySchema = z.infer<
  typeof markDeliveryDeliveredBodySchema
>

@Controller('/deliveries/:deliveryId/delivered')
export class MarkDeliveryAsCompletedController {
  constructor(
    private markDeliveryAsCompleted: MarkDeliveryAsCompletedUseCase,
  ) {}

  @Patch() // update something specific
  @HttpCode(204)
  async handle(
    @Param('deliveryId') deliveryId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: MarkDeliveryDeliveredBodySchema,
  ) {
    const { sub: deliveryManId } = user
    const { attachments } = body

    const result = await this.markDeliveryAsCompleted.execute({
      deliveryId,
      deliveryManId,
      attachmentIds: attachments,
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
