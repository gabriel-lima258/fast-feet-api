import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeDelivery } from 'test/factories/make-delivery'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { MarkDeliveryAsCompletedUseCase } from './mark-delivery-as-complete'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryRecipientsRepository: InMemoryRecipientRepository

let sut: MarkDeliveryAsCompletedUseCase

describe('Mark Delivery As Completed', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    sut = new MarkDeliveryAsCompletedUseCase(
      inMemoryDeliveryManRepository,
      inMemoryDeliveryRepository,
    )
  })

  it('should be able to mark an delivery as completed', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const delivery = makeDelivery({ deliveryManId: deliveryMan.id })
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      deliveryId: delivery.id.toString(),
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryRepository.items[0].deliveredAt).not.toBeNull()
    expect(inMemoryDeliveryRepository.items[0].status).toBe('Delivered')
    expect(
      inMemoryDeliveryRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryDeliveryRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should not be able to mark an delivery as returned without authorization', async () => {
    const delivery = makeDelivery()
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryManId: 'notexistent',
      deliveryId: delivery.id.toString(),
      attachmentIds: ['1'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark an delivery as returned without delivery id', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      deliveryId: 'notexistent',
      attachmentIds: ['1'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to mark an delivery as completed if the delivery person is not the same person who picked it up', async () => {
    const deliveryman01 = makeDeliveryMan()
    const deliveryman02 = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryman01, deliveryman02)

    const delivery = makeDelivery({
      deliveryManId: deliveryman01.id,
    })
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryManId: deliveryman02.id.toString(),
      deliveryId: delivery.id.toString(),
      attachmentIds: ['1'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should persist attachment upon delivery delivered', async () => {
    const deliveryman = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryman)

    const delivery = makeDelivery({
      deliveryManId: deliveryman.id,
    })
    inMemoryDeliveryRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryManId: deliveryman.id.toString(),
      deliveryId: delivery.id.toString(),
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    )
  })
})
