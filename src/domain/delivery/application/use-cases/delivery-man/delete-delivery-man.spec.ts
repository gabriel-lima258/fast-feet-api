import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { DeleteDeliveryManUseCase } from './delete-delivery-man'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAdminRepository: InMemoryAdminRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let sut: DeleteDeliveryManUseCase // sut => system under test

describe('Delete DeliveryMan Use Case', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    sut = new DeleteDeliveryManUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryManRepository,
    )
  })

  it('it should be able to delete an deliveryman', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const deliveryman = makeDeliveryMan()
    // now pass the new deliveryman into memory test
    await inMemoryDeliveryManRepository.create(deliveryman)

    await sut.execute({
      adminId: admin.id.toString(),
      deliveryManId: deliveryman.id.toString(),
    })

    // expect the deliveryman to be deleted in memory
    expect(inMemoryDeliveryManRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an existing deliveryman with non existing administrador', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const deliveryman = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: 'non-existing',
      deliveryManId: deliveryman.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryDeliveryManRepository.items).toHaveLength(1)
  })
})
