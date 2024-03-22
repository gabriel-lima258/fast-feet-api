import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeliveryAvaliableUseCase } from '@/domain/delivery/application/use-cases/delivery/delivery-avaliable'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Patch,
  HttpCode,
  Param,
  BadRequestException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common'

@Controller('/deliveries/:deliveryId/avaliable')
export class DeliveryAvaliableController {
  constructor(private deliveryAvaliable: DeliveryAvaliableUseCase) {}

  @Patch() // update something specific
  @HttpCode(204)
  async handle(
    @Param('deliveryId') deliveryId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: adminId } = user

    const result = await this.deliveryAvaliable.execute({
      adminId,
      deliveryId,
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
