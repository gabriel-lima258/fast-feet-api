import { Either, left, right } from '@/core/either'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { AdminRepository } from '../../repositories/admin-repository'
import { HashGenerator } from '../../cryptography/hash-generator'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface CreateAdminUseCaseRequest {
  name: string
  email: string
  cpf: string
  phone: string
  password: string
}

type CreateAdminUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    cpf,
    phone,
    password,
  }: CreateAdminUseCaseRequest): Promise<CreateAdminUseCaseResponse> {
    const adminWithSameCPF = await this.adminRepository.findByCPF(cpf)

    if (adminWithSameCPF) {
      return left(new UserAlreadyExistsError())
    }

    // hash the password
    const hashedPassword = await this.hashGenerator.hash(password)

    // create the Admin
    const admin = Admin.create({
      name,
      email,
      cpf,
      phone,
      password: hashedPassword,
    })

    // set the admin in repository
    await this.adminRepository.create(admin)

    return right({
      admin,
    })
  }
}
