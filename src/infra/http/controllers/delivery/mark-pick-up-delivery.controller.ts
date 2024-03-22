import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { MarkPickedUpDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/mark-pick-up-delivery'
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
} from '@nestjs/common'

@Controller('/deliveries/:deliveryId/pickedup')
export class MarkPickedUpDeliveryController {
  constructor(private markPickedUpDelivery: MarkPickedUpDeliveryUseCase) {}

  @Patch() // update something specific
  @HttpCode(204)
  async handle(
    @Param('deliveryId') deliveryId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: deliveryManId } = user

    const result = await this.markPickedUpDelivery.execute({
      deliveryId,
      deliveryManId,
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
