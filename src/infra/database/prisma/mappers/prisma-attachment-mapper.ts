import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment'
import { Attachment as PrismaAttachment, Prisma } from '@prisma/client'

// convert attachment prisma to a attachment domain
export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}