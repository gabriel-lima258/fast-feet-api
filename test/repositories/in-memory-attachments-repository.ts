import { AttachmentRepository } from '@/domain/delivery/application/repositories/attachment-repository'
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
