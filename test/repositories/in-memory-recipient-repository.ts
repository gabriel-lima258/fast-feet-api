import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    // splice remove an item from array
    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByCep(cep: string) {
    const recipient = this.items.find((item) => item.cep === cep)

    if (!recipient) {
      return null
    }

    return recipient
  }
}
