import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryAttachment,
  DeliveryAttachmentProps,
} from '@/domain/delivery/enterprise/entities/delivery-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeDeliveryAttachment(
  override: Partial<DeliveryAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryAttachment = DeliveryAttachment.create(
    {
      deliveryId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return deliveryAttachment
}

@Injectable()
export class DeliveryAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryAttachment(
    data: Partial<DeliveryAttachmentProps> = {},
  ): Promise<DeliveryAttachment> {
    const deliveryAttachment = makeDeliveryAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: deliveryAttachment.attachmentId.toString(),
      },
      data: {
        deliverieId: deliveryAttachment.deliveryId.toString(),
      },
    })

    return deliveryAttachment
  }
}
