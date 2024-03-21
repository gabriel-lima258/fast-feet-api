import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient'
import { Recipient as PrismaRecipient, Prisma } from '@prisma/client'

// convert Recipient prisma to a Recipient domain
export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        street: raw.street,
        number: raw.number,
        city: raw.city,
        state: raw.state,
        cep: raw.cep,
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
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
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
