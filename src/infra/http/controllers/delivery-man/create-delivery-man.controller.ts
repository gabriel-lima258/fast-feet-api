import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  MethodNotAllowedException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { UserAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-already-exists-error'
import { CreateDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/create-delivery-man'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const createDeliveryManBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  phone: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createDeliveryManBodySchema)

type CreateDeliveryManBodySchema = z.infer<typeof createDeliveryManBodySchema>

@Controller('/deliverymans')
export class CreateDeliveryManController {
  constructor(private createDeliveryMan: CreateDeliveryManUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateDeliveryManBodySchema,
  ) {
    const { sub: adminId } = user
    const { name, email, cpf, password, phone } = body

    const result = await this.createDeliveryMan.execute({
      adminId,
      name,
      email,
      cpf,
      password,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        case UserAlreadyExistsError:
          throw new ConflictException(error.message) // 409
        default:
          throw new BadRequestException(error.message) // 400
      }
    }
  }
}
