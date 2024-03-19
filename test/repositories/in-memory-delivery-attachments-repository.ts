import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { DeliveryAttachment } from '@/domain/delivery/enterprise/entities/delivery-attachment'

export class InMemoryDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  public items: DeliveryAttachment[] = []

  async findManyByDeliveryId(deliveryId: string) {
    const deliveryAttachments = this.items.filter(
      (item) => item.deliveryId.toString() === deliveryId,
    )

    return deliveryAttachments
  }

  async deleteManyByDeliveryId(deliveryId: string) {
    const deliveryAttachments = this.items.filter(
      (item) => item.deliveryId.toString() !== deliveryId,
    )

    this.items = deliveryAttachments
  }

  async create(attachments: DeliveryAttachment) {
    this.items.push(attachments)
  }

  async createMany(attachments: DeliveryAttachment[]) {
    this.items.push(...attachments)
  }

  async delete(attachments: DeliveryAttachment) {
    const itemIndex = this.items.findIndex((item) => item.id === attachments.id)

    // splice remove an item from array
    this.items.splice(itemIndex, 1)
  }

  async deleteMany(attachments: DeliveryAttachment[]) {
    const deliveryAttachment = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    // splice remove an item from array
    this.items = deliveryAttachment
  }
}
