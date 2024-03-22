import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Get,
  Query,
  MethodNotAllowedException,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { DeliveryPresenter } from '../../presenters/delivery-presenter'
import { FetchDeliveryManDeliveriesUseCase } from '@/domain/delivery/application/use-cases/delivery/fetch-delivery-man-deliveries'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1)) // pipe get string form and transform to a number

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/deliveries/deliverymans')
export class FetchDeliveryManDeliveriesController {
  constructor(
    private fetchDeliveryManDeliveries: FetchDeliveryManDeliveriesUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { sub: deliveryManId } = user

    const result = await this.fetchDeliveryManDeliveries.execute({
      deliveryManId,
      page,
    })

    // if result does't exist
    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message) // 400
      }
    }

    // question recieves results value
    const deliveries = result.value.deliveries

    // convert information with presenter
    return { deliveries: deliveries.map(DeliveryPresenter.toHTTP) }
  }
}
