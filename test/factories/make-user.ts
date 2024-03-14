import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserProps, User } from '@/domain/delivery/enterprise/entities/user'

// factory domain for unit tests
// partial transform any props opcional
export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      cpf: faker.number.int.toString(),
      password: faker.internet.password(),
      ...override,
    },
    id, // if exist an id get it
  )

  return user
}

// factory for e2e tests
/* @Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    // get data from domain
    const user = makeUser(data)

    // setting DB to entity
    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    })

    return user
  }
} */
