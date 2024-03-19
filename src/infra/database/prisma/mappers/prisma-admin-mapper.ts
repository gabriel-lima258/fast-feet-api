import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'
import { User as PrismaUser, Prisma } from '@prisma/client'

// convert Admin prisma to a Admin domain
export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        cpf: raw.cpf,
        password: raw.password,
        phone: raw.phone,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(Admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: Admin.id.toString(),
      name: Admin.name,
      email: Admin.email,
      cpf: Admin.cpf,
      password: Admin.password,
      phone: Admin.phone,
    }
  }
}
