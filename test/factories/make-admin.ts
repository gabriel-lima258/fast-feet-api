import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdminProps, Admin } from '@/domain/delivery/enterprise/entities/admin'

// factory domain for unit tests
// partial transform any props opcional
export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
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

  return admin
}

// factory for e2e tests
/* @Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    // get data from domain
    const admin = makeAdmin(data)

    // setting DB to entity
    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
} */
