import { UserRepository } from '@/domain/delivery/application/repositories/user-repository'
import { User } from '@/domain/delivery/enterprise/entities/user'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[itemIndex] = user
  }

  async delete(user: User) {
    const itemIndex = this.items.findIndex((item) => item.id === user.id)

    // splice remove an item from array
    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByCPF(cpf: string) {
    const user = this.items.find((item) => item.cpf === cpf)

    if (!user) {
      return null
    }

    return user
  }
}
