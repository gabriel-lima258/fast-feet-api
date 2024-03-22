import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CreateDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/create-delivery'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Post,
  HttpCode,
  Body,
  MethodNotAllowedException,
  BadRequestException,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const createDeliveryBodySchema = z.object({
  deliverymanId: z.string().uuid(),
  title: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createDeliveryBodySchema)

type CreateDeliveryBodySchema = z.infer<typeof createDeliveryBodySchema>

@Controller('/recipients/:recipientId/deliveries')
export class CreateDeliveryController {
  constructor(private createDelivery: CreateDeliveryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param('recipientId') recipientId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateDeliveryBodySchema,
  ) {
    const { sub: adminId } = user
    const { title, deliverymanId } = body

    const result = await this.createDelivery.execute({
      adminId,
      title,
      deliverymanId,
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message) // 409
        default:
          throw new BadRequestException(error.message) // 400
      }
    }
  }
}
