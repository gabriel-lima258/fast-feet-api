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
import { FetchNearbyDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/fetch-nearby-delivery'

const nearbyByDeliveryParamSchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

const queryValidationPipe = new ZodValidationPipe(nearbyByDeliveryParamSchema)

type NearbyByDeliveryQueryParamSchema = z.infer<
  typeof nearbyByDeliveryParamSchema
>

@Controller('/deliveries/nearby')
export class FetchNearbyDeliveriesController {
  constructor(private fetchNearbyDelivery: FetchNearbyDeliveryUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) query: NearbyByDeliveryQueryParamSchema,
  ) {
    const { sub: deliveryManId } = user
    const { page, latitude, longitude } = query

    const result = await this.fetchNearbyDelivery.execute({
      userLatitude: latitude,
      userLongitude: longitude,
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
