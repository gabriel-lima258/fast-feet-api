import { CreateAdminUseCase } from '@/domain/delivery/application/use-cases/admin/create-admin'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-vaidation.pipe'
import { UserAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-already-exists-error'

const createAdminBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  phone: z.string(),
  password: z.string(),
})

type CreateAdminBodySchema = z.infer<typeof createAdminBodySchema>

@Controller('/admins')
@Public()
export class CreateAdminController {
  constructor(private createAdmin: CreateAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAdminBodySchema))
  async handle(@Body() body: CreateAdminBodySchema) {
    const { name, email, cpf, password, phone } = body

    const result = await this.createAdmin.execute({
      name,
      email,
      cpf,
      password,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message) // 409
        default:
          throw new BadRequestException(error.message) // 400
      }
    }
  }
}
