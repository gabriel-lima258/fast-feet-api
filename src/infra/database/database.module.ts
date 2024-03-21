import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository'
import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PrismaDeliveryManRepository } from './prisma/repositories/prisma-delivery-man-repository'
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'

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
  ],
  exports: [
    PrismaService,
    AdminRepository,
    DeliveryManRepository,
    RecipientRepository,
  ],
})
export class DatabaseModule {}
