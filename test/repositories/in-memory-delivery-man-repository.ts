import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'

export class InMemoryDeliveryManRepository implements DeliveryManRepository {
  public items: DeliveryMan[] = []

  async create(deliveryMan: DeliveryMan) {
    this.items.push(deliveryMan)
  }

  async save(deliveryMan: DeliveryMan) {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryMan.id)

    this.items[itemIndex] = deliveryMan
  }

  async delete(deliveryMan: DeliveryMan) {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryMan.id)

    // splice remove an item from array
    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const deliveryMan = this.items.find((item) => item.id.toString() === id)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findByCPF(cpf: string) {
    const deliveryMan = this.items.find((item) => item.cpf === cpf)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findByEmail(email: string) {
    const deliveryMan = this.items.find((item) => item.email === email)

    if (!deliveryMan) {
      return null
    }

    return deliveryMan
  }

  async findMany({ page }: PaginationParams) {
    const deliveryMan = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return deliveryMan
  }
}
