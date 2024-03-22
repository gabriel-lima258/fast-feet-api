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
import { EditDeliveryManController } from './controllers/delivery-man/edit-delivery-man.controller'
import { EditDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/edit-delivery-man'
import { FetchDeliveryManController } from './controllers/delivery-man/fetch-delivery-man.controller'
import { FetchDeliveryManUseCase } from '@/domain/delivery/application/use-cases/delivery-man/fetch-many-delivery-man'
import { CreateRecipientController } from './controllers/recipient/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/create-recipient'
import { EditRecipientController } from './controllers/recipient/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/edit-recipient'
import { DeleteRecipientController } from './controllers/recipient/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/delete-recipient'
import { FetchRecipientController } from './controllers/recipient/fetch-recipient.controller'
import { FetchRecipientUseCase } from '@/domain/delivery/application/use-cases/recipient/fetch-recipient'
import { UploadAttachmentController } from './controllers/attachment/upload-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/delivery/application/use-cases/attachment/upload-and-create-attachment'
import { StorageModule } from '../upload/storage.module'
import { CreateDeliveryController } from './controllers/delivery/create-delivery.controller'
import { CreateDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/create-delivery'
import { DeleteDeliveryController } from './controllers/delivery/delete-delivery.controller'
import { DeleteDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/delete.delivery'
import { EditDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/edit-delivery'
import { EditDeliveryController } from './controllers/delivery/edit-delivery.controller'
import { FetchDeliveryController } from './controllers/delivery/fetch-delivery.controller'
import { FetchDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/fetch-delivery'
import { FetchDeliveryManDeliveriesUseCase } from '@/domain/delivery/application/use-cases/delivery/fetch-delivery-man-deliveries'
import { FetchDeliveryManDeliveriesController } from './controllers/delivery/fetch-delivery-man-deliveries.controller'
import { FetchNearbyDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/fetch-nearby-delivery'
import { FetchNearbyDeliveriesController } from './controllers/delivery/fetch-nearby-delivery.controller'
import { DeliveryAvaliableController } from './controllers/delivery/delivery-avaliable.controller'
import { DeliveryAvaliableUseCase } from '@/domain/delivery/application/use-cases/delivery/delivery-avaliable'
import { MarkDeliveryReturnedController } from './controllers/delivery/mark-delivery-returned.controller'
import { MarkDeliveryReturnedUseCase } from '@/domain/delivery/application/use-cases/delivery/mark-delivery-returned'
import { MarkPickedUpDeliveryController } from './controllers/delivery/mark-pick-up-delivery.controller'
import { MarkPickedUpDeliveryUseCase } from '@/domain/delivery/application/use-cases/delivery/mark-pick-up-delivery'
import { MarkDeliveryAsCompletedController } from './controllers/delivery/mark-delivery-as-complete.controller'
import { MarkDeliveryAsCompletedUseCase } from '@/domain/delivery/application/use-cases/delivery/mark-delivery-as-complete'
import { ReadNotificationController } from './controllers/notification/read-notification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAdminController,
    AuthenticateAdminController,
    CreateDeliveryManController,
    AuthenticateDeliveryManController,
    DeleteDeliveryManController,
    ChangePasswordDeliveryManController,
    EditDeliveryManController,
    FetchDeliveryManController,
    CreateRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    FetchRecipientController,
    UploadAttachmentController,
    CreateDeliveryController,
    DeleteDeliveryController,
    EditDeliveryController,
    FetchDeliveryController,
    FetchDeliveryManDeliveriesController,
    FetchNearbyDeliveriesController,
    DeliveryAvaliableController,
    MarkDeliveryReturnedController,
    MarkPickedUpDeliveryController,
    MarkDeliveryAsCompletedController,
    ReadNotificationController,
  ],
  providers: [
    CreateAdminUseCase,
    AuthenticateAdminUseCase,
    CreateDeliveryManUseCase,
    AuthenticateDeliveryManUseCase,
    DeleteDeliveryManUseCase,
    ChangePasswordDeliverymanUseCase,
    EditDeliveryManUseCase,
    FetchDeliveryManUseCase,
    CreateRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    FetchRecipientUseCase,
    UploadAndCreateAttachmentUseCase,
    CreateDeliveryUseCase,
    DeleteDeliveryUseCase,
    EditDeliveryUseCase,
    FetchDeliveryUseCase,
    FetchDeliveryManDeliveriesUseCase,
    FetchNearbyDeliveryUseCase,
    DeliveryAvaliableUseCase,
    MarkDeliveryReturnedUseCase,
    MarkPickedUpDeliveryUseCase,
    MarkDeliveryAsCompletedUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
