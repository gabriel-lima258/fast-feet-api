import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { FetchRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/fetch-recipient'
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
import { RecipientPresenter } from '../../presenters/recipient-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1)) // pipe get string form and transform to a number

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/recipients')
export class FetchRecipientController {
  constructor(private fetchRecentQuestions: FetchRecipientUseCase) {}

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
    const recipients = result.value.recipients

    // convert information with presenter
    return { recipients: recipients.map(RecipientPresenter.toHTTP) }
  }
}
