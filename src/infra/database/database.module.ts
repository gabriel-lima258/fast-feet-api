import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository'
import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-delivery-man-repository'
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'
import { AttachmentRepository } from '@/domain/delivery/application/repositories/attachment-repository'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'
import { DeliveryRepository } from '@/domain/delivery/application/repositories/delivery-repository'
import { PrismaDeliveryRepository } from './prisma/repositories/prisma-delivery-repository'
import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { PrismaDeliveryAttachmentsRepository } from './prisma/repositories/prisma-attachment-delivery-repository'
import { NotificationRepository } from '@/domain/notification/application/repositories/notication-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: AdminRepository,
      useClass: PrismaAdminRepository,
    },
    {
      provide: DeliveryManRepository,
      useClass: PrismaDeliveryManRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: DeliveryRepository,
      useClass: PrismaDeliveryRepository,
    },
    {
      provide: DeliveryAttachmentsRepository,
      useClass: PrismaDeliveryAttachmentsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminRepository,
    DeliveryManRepository,
    RecipientRepository,
    AttachmentRepository,
    DeliveryRepository,
    DeliveryAttachmentsRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
