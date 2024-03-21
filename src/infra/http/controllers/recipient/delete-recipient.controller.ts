import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/delete-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import {
  Controller,
  Delete,
  HttpCode,
  Param,
  BadRequestException,
} from '@nestjs/common'

@Controller('/recipients/:id')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') recipientId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { sub: adminId } = user

    const result = await this.deleteRecipient.execute({
      recipientId,
      adminId,
    })

    // if result does't exist
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
