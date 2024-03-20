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
import { DeleteDeliveryManController } from './controllers/delivery-man/delete-delivery-man.controller'
import { DeleteDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/delete-delivery-man'
import { ChangePasswordDeliveryManController } from './controllers/delivery-man/change-password-delivery-man.controller'
import { ChangePasswordDeliverymanUseCase } from '@/domain/delivery/application/use-cases/delivery-man/change-password-delivery-man'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAdminController,
    AuthenticateAdminController,
    CreateDeliveryManController,
    AuthenticateDeliveryManController,
    DeleteDeliveryManController,
    ChangePasswordDeliveryManController,
  ],
  providers: [
    CreateAdminUseCase,
    AuthenticateAdminUseCase,
    CreateDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    ChangePasswordDeliverymanUseCase,
  ],
})
export class HttpModule {}
