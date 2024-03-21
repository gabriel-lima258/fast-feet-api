import {
  Controller,
  Get,
  Query,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { FetchDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/fetch-many-delivery-man'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { DeliveryManPresenter } from '../../presenters/delivery-man-presenter'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1)) // pipe get string form and transform to a number

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/deliverymans')
export class FetchDeliveryManController {
  constructor(private fetchRecentQuestions: FetchDeliveryManUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { sub: adminId } = user

    const result = await this.fetchRecentQuestions.execute({
      adminId,
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
    const deliverymans = result.value.deliverymans

    // convert information with presenter
    return { deliverymans: deliverymans.map(DeliveryManPresenter.toHTTP) }
  }
}
