import { WatchedList } from '@/core/entities/watched-list'
import { DeliveryAttachment } from './delivery-attachment'

// class that acess one class that must be watched-list
export class DeliveryAttachmentList extends WatchedList<DeliveryAttachment> {
  compareItems(a: DeliveryAttachment, b: DeliveryAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
