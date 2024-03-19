import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { CreateDeliveryUseCase } from './create-delivery'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { makeRecipient } from 'test/factories/make-recipient'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let sut: CreateDeliveryUseCase

describe('Create Delivery Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientRepository,
    )
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new CreateDeliveryUseCase(
      inMemoryDeliveryRepository,
      inMemoryAdminRepository,
      inMemoryDeliveryManRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to create a new delivery', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    const deliveryman = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      recipientId: recipient.id.toString(),
      title: 'Pacote 1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: inMemoryDeliveryRepository.items[0],
    })
  })

  it('should not be able to create with non existing adminstrator', async () => {
    const deliveryman = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-existing-admin',
      deliverymanId: deliveryman.id.toString(),
      recipientId: recipient.id.toString(),
      title: 'Pacote 1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to create with non existing deliveryman', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: 'non-existent',
      recipientId: recipient.id.toString(),
      title: 'Pacote 1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create with non existing recipient', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    const deliveryman = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      recipientId: 'non-existing',
      title: 'Pacote 1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
