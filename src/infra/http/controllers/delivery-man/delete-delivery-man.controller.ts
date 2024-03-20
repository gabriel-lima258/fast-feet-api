import { DeleteDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/delete-delivery-man'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Delete,
  HttpCode,
  Param,
  BadRequestException,
} from '@nestjs/common'

@Controller('/deliverymans/:id')
export class DeleteDeliveryManController {
  constructor(private deleteDeliveryMan: DeleteDeliveryManUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') deliveryManId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: adminId } = user

    const result = await this.deleteDeliveryMan.execute({
      deliveryManId,
      adminId,
    })

    // if result does't exist
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
