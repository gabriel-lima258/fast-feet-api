import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Put,
  HttpCode,
  Param,
  Body,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { EditDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/edit-delivery-man'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-already-exists-error'

const editDeliveryManBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  phone: z.string(),
})

// pipe validation zod
const bodyValidationPipe = new ZodValidationPipe(editDeliveryManBodySchema)

// type the variables editd in the zod object
type EditDeliveryManBodySchema = z.infer<typeof editDeliveryManBodySchema>

@Controller('/deliverymans/:id')
export class EditDeliveryManController {
  constructor(private editDeliveryMan: EditDeliveryManUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') deliverymanId: string,
    @Body(bodyValidationPipe) body: EditDeliveryManBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, email, phone, cpf } = body
    const { sub: adminId } = user

    const result = await this.editDeliveryMan.execute({
      adminId,
      deliverymanId,
      name,
      email,
      cpf,
      phone,
    })

    // if result does't exist
    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case UserAlreadyExistsError:
          throw new ConflictException(error.message) // 409
        default:
          throw new BadRequestException(error.message) // 400
      }
    }
  }
}
