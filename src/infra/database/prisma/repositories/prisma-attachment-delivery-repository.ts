import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliveryAttachment } from '@/domain/delivery/enterprise/entities/delivery-attachment'
import { PrismaDeliveryAttachmentMapper } from '../mappers/prisma-deivery-attachment-mapper'

@Injectable()
export class PrismaDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(attachments: DeliveryAttachment): Promise<void> {
    const data = PrismaDeliveryAttachmentMapper.toPrisma(attachments)

    await this.prisma.attachment.update(data)
  }

  async delete(attachments: DeliveryAttachment): Promise<void> {
    await this.prisma.attachment.delete({
      where: {
        id: attachments.id.toString(),
      },
    })
  }

  async createMany(attachments: DeliveryAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaDeliveryAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: DeliveryAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentsIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    })
  }

  async findManyByDeliveryId(
    deliveryId: string,
  ): Promise<DeliveryAttachment[]> {
    const deliveryAttachments = await this.prisma.attachment.findMany({
      where: {
        deliveryId,
      },
    })

    return deliveryAttachments.map(PrismaDeliveryAttachmentMapper.toDomain)
  }

  async deleteManyByDeliveryId(deliveryId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        deliveryId,
      },
    })
  }
}
