import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryMan,
  DeliveryManProps,
} from '@/domain/delivery/enterprise/entities/deliveryman'
import { faker } from '@faker-js/faker'

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryMan = DeliveryMan.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.number.int.toString(),
      phone: faker.phone.number.toString(),
      password: faker.internet.password(),
      ...override,
    },
    id, // if exist an id get it
  )

  return deliveryMan
}

// factory for e2e tests
/* @Injectable()
export class DeliveryManFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryMan(data: Partial<DeliveryManProps> = {}): Promise<DeliveryMan> {
    // get data from domain
    const DeliveryMan = makeDeliveryMan(data)

    // setting DB to entity
    await this.prisma.DeliveryMan.create({
      data: PrismaDeliveryManMapper.toPrisma(DeliveryMan),
    })

    return DeliveryMan
  }
} */
