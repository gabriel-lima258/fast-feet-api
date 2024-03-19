import { makeDelivery } from 'test/factories/make-delivery'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notication-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { waitFor } from 'test/utils/wait-for'
import { SpyInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnChangeStatus } from './on-change-status'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Change Status', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    // verify if method execute was called
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // create an subscriber for listening
    new OnChangeStatus(inMemoryRecipientRepository, sendNotificationUseCase)
  })

  it('should send a notification when status from delivery change', async () => {
    const recipient = makeRecipient()
    const delivery = makeDelivery({
      recipientId: recipient.id,
    })

    inMemoryRecipientRepository.create(recipient)
    inMemoryDeliveryRepository.create(delivery)

    delivery.status = 'Delivered'

    inMemoryDeliveryRepository.save(delivery)

    // waiting all context be calling
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
