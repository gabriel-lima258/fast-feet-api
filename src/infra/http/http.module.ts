import { AuthenticateAdminUseCase } from './../../domain/delivery/application/use-cases/admin/authenticate-admin'
import { Module } from '@nestjs/common'
import { CreateAdminController } from './controllers/admin/create-admin.controller'
import { CreateAdminUseCase } from '@/domain/delivery/application/use-cases/admin/create-admin'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateAdminController } from './controllers/admin/authenticate-admin.controller'
import { CreateDeliveryManController } from './controllers/delivery-man/create-delivery-man.controller'
import { CreateDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/create-delivery-man'
import { AuthenticateDeliveryManController } from './controllers/delivery-man/authenticate-delivery-man.controller'
import { AuthenticateDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/authenticate-delivery-man'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAdminController,
    AuthenticateAdminController,
    CreateDeliveryManController,
    AuthenticateDeliveryManController,
  ],
  providers: [
    CreateAdminUseCase,
    AuthenticateAdminUseCase,
    CreateDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
  ],
})
export class HttpModule {}
