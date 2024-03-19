import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { EditDeliveryManUseCase } from './edit-delivery-man'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: EditDeliveryManUseCase

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()

    sut = new EditDeliveryManUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryManRepository,
    )
  })

  it('should be able to edit an existing deliveryman', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    const deliveryman = makeDeliveryMan({
      cpf: '132456',
      name: 'John',
      phone: '123456',
      password: '123456',
    })

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      email: 'alovcteste@gmail.com',
      cpf: '123456789',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryManRepository.items[0]).toMatchObject({
      cpf: '123456789',
      email: 'alovcteste@gmail.com',
    })
  })
})
