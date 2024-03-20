import { Module } from '@nestjs/common'
import { CreateAdminController } from './controllers/admin/create-admin.controller'
import { CreateAdminUseCase } from '@/domain/delivery/application/use-cases/admin/create-admin'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAdminController],
  providers: [CreateAdminUseCase],
})
export class HttpModule {}
