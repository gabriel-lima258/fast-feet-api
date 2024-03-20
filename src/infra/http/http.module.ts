import { AuthenticateAdminUseCase } from './../../domain/delivery/application/use-cases/admin/authenticate-admin'
import { Module } from '@nestjs/common'
import { CreateAdminController } from './controllers/admin/create-admin.controller'
import { CreateAdminUseCase } from '@/domain/delivery/application/use-cases/admin/create-admin'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateAdminController } from './controllers/admin/authenticate-admin.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAdminController, AuthenticateAdminController],
  providers: [CreateAdminUseCase, AuthenticateAdminUseCase],
})
export class HttpModule {}
