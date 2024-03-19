import { makeRecipient } from 'test/factories/make-recipient'
import { makeDelivery } from 'test/factories/make-delivery'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { FetchDeliveryManDeliveriesUseCase } from './fetch-delivery-man-deliveries'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let sut: FetchDeliveryManDeliveriesUseCase

describe('Fetch Delivery Man Deliveries Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientRepository,
    )
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new FetchDeliveryManDeliveriesUseCase(
      inMemoryDeliveryManRepository,
      inMemoryDeliveryRepository,
    )
  })

  it('should be able to fetch deliveries', async () => {
    const deliveryMan1 = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan1)

    const recipient1 = makeRecipient()
    const recipient2 = makeRecipient()
    inMemoryRecipientRepository.items.push(recipient1, recipient2)

    const delivery1 = makeDelivery({
      deliveryManId: deliveryMan1.id,
      recipientId: recipient1.id,
    })
    const delivery2 = makeDelivery({
      deliveryManId: deliveryMan1.id,
      recipientId: recipient2.id,
    })
    inMemoryDeliveryRepository.items.push(delivery1, delivery2)

    const result = await sut.execute({
      deliveryManId: deliveryMan1.id.toString(),
      page: 1,
    })

    if (result.isRight()) {
      expect(result.value.deliveries).toHaveLength(2)
    }
  })

  it('should not be able to fetch paginated delivery without deliveryMan id', async () => {
    const deliveryMan1 = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan1)

    const recipient1 = makeRecipient()
    const recipient2 = makeRecipient()
    inMemoryRecipientRepository.items.push(recipient1, recipient2)

    const delivery1 = makeDelivery({
      deliveryManId: deliveryMan1.id,
      recipientId: recipient1.id,
    })
    const delivery2 = makeDelivery({
      deliveryManId: deliveryMan1.id,
      recipientId: recipient2.id,
    })
    inMemoryDeliveryRepository.items.push(delivery1, delivery2)

    const result = await sut.execute({
      deliveryManId: 'no-existing',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to fetch paginated delivery from deliveryman', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const recipient = makeRecipient()
    inMemoryRecipientRepository.items.push(recipient)

    for (let i = 1; i <= 22; i++) {
      const delivery = makeDelivery({
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
      })

      inMemoryDeliveryRepository.items.push(delivery)
    }

    const result = await sut.execute({
      deliveryManId: deliveryMan.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.deliveries).toHaveLength(2)
    }
  })
})
