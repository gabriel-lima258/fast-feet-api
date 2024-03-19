import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = []

  async create(admin: Admin) {
    this.items.push(admin)
  }

  async save(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items[itemIndex] = admin
  }

  async delete(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    // splice remove an item from array
    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByCPF(cpf: string) {
    const admin = this.items.find((item) => item.cpf === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByEmail(email: string) {
    const admin = this.items.find((item) => item.email === email)

    if (!admin) {
      return null
    }

    return admin
  }
}
