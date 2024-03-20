import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/admin/authenticate-admin'
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

const authenticateAdminBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

// type the variables created in the zod object
type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>

@Controller('/sessions/admin')
@Public()
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateAdminBodySchema)) // zod's pipe
  async handle(@Body() body: AuthenticateAdminBodySchema) {
    const { cpf, password } = body

    // verify if email is equal in body
    const result = await this.authenticateAdmin.execute({
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
