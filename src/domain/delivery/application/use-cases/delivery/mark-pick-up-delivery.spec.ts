import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDelivery } from 'test/factories/make-delivery'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { MarkPickedUpDeliveryUseCase } from './mark-pick-up-delivery'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryRecipientsRepository: InMemoryRecipientRepository

let sut: MarkPickedUpDeliveryUseCase

describe('Mark Picked Up Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    sut = new MarkPickedUpDeliveryUseCase(
      inMemoryDeliveryManRepository,
      inMemoryDeliveryRepository,
    )
  })

  it('should be able to mark an delivery as picked up', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const delivery = makeDelivery()
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      deliveryId: delivery.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryRepository.items[0].pickedUpAt).not.toBeNull()
    expect(inMemoryDeliveryRepository.items[0].status).toBe('Picked up')
  })

  it('should not be able to mark an delivery as picked up without authorization', async () => {
    const delivery = makeDelivery()
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryManId: 'notexistent',
      deliveryId: delivery.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark an delivery as picked up without delivery id', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      deliveryId: 'notexistent',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
