import { ChangePasswordDeliverymanUseCase } from './../../../../domain/delivery/application/use-cases/delivery-man/change-password-delivery-man'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Put,
  HttpCode,
  Param,
  Body,
  BadRequestException,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'

const changePasswordDeliveryManBodySchema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
})

// pipe validation zod
const bodyValidationPipe = new ZodValidationPipe(
  changePasswordDeliveryManBodySchema,
)

// type the variables editd in the zod object
type ChangePasswordDeliveryManBodySchema = z.infer<
  typeof changePasswordDeliveryManBodySchema
>

@Controller('/deliverymans/:id')
export class ChangePasswordDeliveryManController {
  constructor(
    private changePasswordDeliveryMan: ChangePasswordDeliverymanUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('id') deliverymanId: string,
    @Body(bodyValidationPipe) body: ChangePasswordDeliveryManBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { password, confirmPassword } = body
    const { sub: adminId } = user

    const result = await this.changePasswordDeliveryMan.execute({
      adminId,
      deliverymanId,
      password,
      confirmPassword,
    })

    // if result does't exist
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
