import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error'
import {
  Controller,
  Post,
  UsePipes,
  Body,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { Public } from '@/infra/auth/public'
import { AuthenticateDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/authenticate-delivery-man'

const authenticateDeliveryManBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

// type the variables created in the zod object
type AuthenticateDeliveryManBodySchema = z.infer<
  typeof authenticateDeliveryManBodySchema
>

@Controller('/sessions/deliveryman')
@Public()
export class AuthenticateDeliveryManController {
  constructor(
    private authenticateDeliveryMan: AuthenticateDeliveryManUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateDeliveryManBodySchema)) // zod's pipe
  async handle(@Body() body: AuthenticateDeliveryManBodySchema) {
    const { cpf, password } = body

    // verify if email is equal in body
    const result = await this.authenticateDeliveryMan.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message) // 401
        default:
          throw new BadRequestException(error.message) // 400
      }
    }

    // create token result, sub refer what id result is
    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
