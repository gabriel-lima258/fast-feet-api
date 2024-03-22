import { DeleteDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/delete.delivery'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Delete,
  HttpCode,
  Param,
  BadRequestException,
} from '@nestjs/common'

@Controller('/deliveries/:id')
export class DeleteDeliveryController {
  constructor(private deleteDelivery: DeleteDeliveryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') deliveryId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: adminId } = user

    const result = await this.deleteDelivery.execute({
      deliveryId,
      adminId,
    })

    // if result does't exist
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
