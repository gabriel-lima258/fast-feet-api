import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliveryAttachment } from '@/domain/delivery/enterprise/entities/delivery-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

// convert deliveryattachment prisma to a deliveryattachment domain
export class PrismaDeliveryAttachmentMapper {
  // just domain method because there's no such convert and persistence action on DB
  static toDomain(raw: PrismaAttachment): DeliveryAttachment {
    if (!raw.deliveryId) {
      throw new Error('Invalid attachment type')
    }

    return DeliveryAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        deliveryId: new UniqueEntityID(raw.deliveryId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(raw: DeliveryAttachment): Prisma.AttachmentUpdateArgs {
    const data = {
      where: {
        id: raw.attachmentId.toString(),
      },
      data: {
        deliveryId: raw.deliveryId.toString(),
      },
    }

    return data
  }

  static toPrismaUpdateMany(
    attachments: DeliveryAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    // get attachments ids
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    // update attachments where in DeliveryAttachment[] and set their deliveryId
    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        deliveryId: attachments[0].deliveryId.toString(),
      },
    }
  }
}
