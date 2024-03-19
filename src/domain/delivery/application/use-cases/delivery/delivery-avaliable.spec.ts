import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDelivery } from 'test/factories/make-delivery'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { DeliveryAvailableUseCase } from './delivery-avaliable'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeAdmin } from 'test/factories/make-admin'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryRecipientsRepository: InMemoryRecipientRepository

let sut: DeliveryAvailableUseCase

describe('Mark Delivery Waiting', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    sut = new DeliveryAvailableUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryRepository,
    )
  })

  it('should be able to mark an delivery as waiting', async () => {
    const admin = makeAdmin()
    inMemoryAdminRepository.items.push(admin)

    const delivery = makeDelivery()
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryRepository.items[0].postedAt).not.toBeNull()
    expect(inMemoryDeliveryRepository.items[0].status).toBe('Waiting')
  })

  it('should not be able to mark an delivery as waiting without authorization', async () => {
    const delivery = makeDelivery()
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: 'notexistent',
      deliveryId: delivery.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark an delivery as waiting without delivery id', async () => {
    const admin = makeAdmin()
    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: 'notexistent',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
