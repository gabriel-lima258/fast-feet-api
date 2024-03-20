import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Delivery,
  DeliveryProps,
} from '@/domain/delivery/enterprise/entities/delivery'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

// factory domain for unit tests
// partial transform any props opcional
export function makeDelivery(
  override: Partial<DeliveryProps> = {},
  id?: UniqueEntityID,
) {
  const delivery = Delivery.create(
    {
      recipientId: new UniqueEntityID(),
      deliveryManId: new UniqueEntityID(),
      title: faker.commerce.productName(),
      ...override,
    },
    id, // if exist an id get it
  )

  return delivery
}

// factory for e2e tests
@Injectable()
export class DeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivery(
    data: Partial<DeliveryProps> = {},
  ): Promise<Delivery> {
    // get data from domain
    const delivery = makeDelivery(data)

    // setting DB to entity
    await this.prisma.delivery.create({
      data: PrismaDeliveryMapper.toPrisma(delivery),
    })

    return delivery
  }
}
