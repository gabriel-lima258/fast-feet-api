import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliveryAttachmentProps {
  deliveryId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class DeliveryAttachment extends Entity<DeliveryAttachmentProps> {
  get deliveryId() {
    return this.props.deliveryId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: DeliveryAttachmentProps, id?: UniqueEntityID) {
    const attachment = new DeliveryAttachment(props, id)

    return attachment
  }
}
