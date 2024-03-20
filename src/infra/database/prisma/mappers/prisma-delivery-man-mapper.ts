import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'
import { User as PrismaUser, Prisma } from '@prisma/client'

// convert DeliveryMan prisma to a DeliveryMan domain
export class PrismaDeliveryManMapper {
  static toDomain(raw: PrismaUser): DeliveryMan {
    return DeliveryMan.create(
      {
        name: raw.name,
        email: raw.email,
        cpf: raw.cpf,
        password: raw.password,
        phone: raw.phone,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliveryMan: DeliveryMan): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryMan.id.toString(),
      name: deliveryMan.name,
      email: deliveryMan.email,
      cpf: deliveryMan.cpf,
      password: deliveryMan.password,
      phone: deliveryMan.phone,
      createdAt: deliveryMan.createdAt,
    }
  }
}
