import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { DeleteDeliveryUseCase } from './delete.delivery'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { makeDeliveryAttachment } from 'test/factories/make-delivery-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: DeleteDeliveryUseCase // sut => system under test

describe('Delete DeliveryMan Use Case', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientRepository,
    )
    sut = new DeleteDeliveryUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryRepository,
    )
  })

  it('it should be able to delete a delivery', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const delivery = makeDelivery()
    // now pass the new delivery into memory test
    await inMemoryDeliveryRepository.create(delivery)

    inMemoryDeliveryAttachmentRepository.items.push(
      makeDeliveryAttachment({
        attachmentId: new UniqueEntityID('1'),
        deliveryId: delivery.id,
      }),
      makeDeliveryAttachment({
        attachmentId: new UniqueEntityID('2'),
        deliveryId: delivery.id,
      }),
    )

    await sut.execute({
      adminId: admin.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    // expect the deliveryman to be deleted in memory
    expect(inMemoryDeliveryRepository.items).toHaveLength(0)
    expect(inMemoryDeliveryAttachmentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an existing delivery with non existing administrador', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const delivery = makeDelivery()
    // now pass the new delivery into memory test
    await inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      adminId: 'non-existing',
      deliveryId: delivery.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryDeliveryRepository.items).toHaveLength(1)
  })
})
