import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { Delivery as PrismaDelivery, Prisma } from '@prisma/client'

// convert Delivery prisma to a Delivery domain
export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    return Delivery.create(
      {
        deliveryManId: new UniqueEntityID(raw.userId),
        recipientId: new UniqueEntityID(raw.recipientId),
        title: raw.title,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id.toString(),
      recipientId: delivery.recipientId.toString(),
      userId: delivery.deliveryManId.toString(),
      title: delivery.title,
      status: delivery.status,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    }
  }
}
