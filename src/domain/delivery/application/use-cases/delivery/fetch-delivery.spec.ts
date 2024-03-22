import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDelivery } from 'test/factories/make-delivery'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliveryRepository } from 'test/repositories/in-memory-delivery-repository'
import { FetchDeliveryUseCase } from './fetch-delivery'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryDeliveryAttachmentRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveryRepository: InMemoryDeliveryRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: FetchDeliveryUseCase

describe('Fetch Delivery Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryDeliveryAttachmentRepository =
      new InMemoryDeliveryAttachmentsRepository()
    inMemoryDeliveryRepository = new InMemoryDeliveryRepository(
      inMemoryDeliveryAttachmentRepository,
      inMemoryRecipientRepository,
    )
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new FetchDeliveryUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryRepository,
    )
  })

  it('should be able to fetch delivery', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    await inMemoryDeliveryRepository.create(makeDelivery())
    await inMemoryDeliveryRepository.create(makeDelivery())
    await inMemoryDeliveryRepository.create(makeDelivery())

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 1,
    })

    if (result.isRight()) {
      expect(result.value.deliveries).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated delivery', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryRepository.create(makeDelivery())
    }

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 2,
    })

    if (result.isRight()) {
      expect(result.value.deliveries).toHaveLength(2)
    }
  })

  it('should not be able to fetch paginated delivery without administrator id', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryRepository.create(makeDelivery())
    }

    const result = await sut.execute({
      adminId: 'non-existing',
      page: 2,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
