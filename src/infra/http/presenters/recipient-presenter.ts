import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      street: recipient.street,
      number: recipient.number,
      city: recipient.city,
      state: recipient.state,
      cep: recipient.cep,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    }
  }
}
