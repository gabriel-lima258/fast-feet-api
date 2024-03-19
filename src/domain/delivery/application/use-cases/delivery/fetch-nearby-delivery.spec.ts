import { makeRecipient } from 'test/factories/make-recipient'
import { makeDelivery } from 'test/factories/make-delivery'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchNearbyDeliveryUseCase } from './fetch-nearby-delivery'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let sut: FetchNearbyDeliveryUseCase

describe('Fetch Nearby Delivery Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientRepository,
    )
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new FetchNearbyDeliveryUseCase(
      inMemoryDeliveryManRepository,
      inMemoryDeliveryRepository,
    )
  })

  it('should be able to fetch nearby delivery from delivery man', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const recipient1 = makeRecipient({
      name: 'near recipient',
      latitude: -16.0053338,
      longitude: -47.9963359,
    })
    const recipient2 = makeRecipient({
      name: 'near recipient',
      latitude: -16.0053338,
      longitude: -47.9963359,
    })
    const recipient3 = makeRecipient({
      name: 'far recipient',
      latitude: -15.6337207,
      longitude: -47.6455277,
    })
    inMemoryRecipientRepository.items.push(recipient1, recipient2, recipient3)

    const delivery1 = makeDelivery({
      title: 'near-delivery-1',
      deliveryManId: deliveryMan.id,
      recipientId: recipient1.id,
    })
    const delivery2 = makeDelivery({
      title: 'near-delivery-2',
      deliveryManId: deliveryMan.id,
      recipientId: recipient2.id,
    })
    const delivery3 = makeDelivery({
      title: 'far-delivery-3',
      deliveryManId: deliveryMan.id,
      recipientId: recipient3.id,
    })
    inMemoryDeliveryRepository.items.push(delivery1, delivery2, delivery3)

    const result = await sut.execute({
      userLatitude: -15.9975111,
      userLongitude: -47.999245,
      deliveryManId: deliveryMan.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveries: [
        expect.objectContaining({ title: 'near-delivery-1' }),
        expect.objectContaining({ title: 'near-delivery-2' }),
      ],
    })
  })

  it('should not be able to fetch paginated delivery without deliveryMan id', async () => {
    const deliveryMan = makeDeliveryMan()
    inMemoryDeliveryManRepository.items.push(deliveryMan)

    const recipient1 = makeRecipient()
    const recipient2 = makeRecipient()
    inMemoryRecipientRepository.items.push(recipient1, recipient2)

    const delivery1 = makeDelivery({
      deliveryManId: deliveryMan.id,
      recipientId: recipient1.id,
    })
    const delivery2 = makeDelivery({
      deliveryManId: deliveryMan.id,
      recipientId: recipient2.id,
    })
    inMemoryDeliveryRepository.items.push(delivery1, delivery2)

    const result = await sut.execute({
      userLatitude: -15.9975111,
      userLongitude: -47.999245,
      deliveryManId: 'no-existing',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
