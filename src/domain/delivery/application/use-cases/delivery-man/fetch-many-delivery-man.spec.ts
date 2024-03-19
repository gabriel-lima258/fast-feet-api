import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { FetchDeliveryManUseCase } from './fetch-many-delivery-man'
import { makeAdmin } from 'test/factories/make-admin'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: FetchDeliveryManUseCase

describe('Fetch DeliveryMan Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new FetchDeliveryManUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryManRepository,
    )
  })

  it('should be able to fetch deliveryMan', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    await inMemoryDeliveryManRepository.create(makeDeliveryMan())
    await inMemoryDeliveryManRepository.create(makeDeliveryMan())
    await inMemoryDeliveryManRepository.create(makeDeliveryMan())

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 1,
    })

    if (result.isRight()) {
      expect(result.value.deliveryman).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated deliveryMan', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryManRepository.create(makeDeliveryMan())
    }

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 2,
    })

    if (result.isRight()) {
      expect(result.value.deliveryman).toHaveLength(2)
    }
  })

  it('should not be able to fetch paginated deliveryMan without administrator id', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveryManRepository.create(makeDeliveryMan())
    }

    const result = await sut.execute({
      adminId: 'non-existing',
      page: 2,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
