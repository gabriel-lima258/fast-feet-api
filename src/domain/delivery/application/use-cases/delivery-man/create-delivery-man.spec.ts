import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { CreateDeliveryManUseCase } from './create-delivery-man'
import { makeAdmin } from 'test/factories/make-admin'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher
let sut: CreateDeliveryManUseCase // sut => system under test

describe('Create Delivery Man Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateDeliveryManUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryManRepository,
      fakeHasher,
    )
  })

  it('should be able to register a delivery man', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'Gabriel',
      email: 'gabriel@gmail.com',
      cpf: '08588107080',
      phone: '992837932',
      password: '123456',
    })

    // expect success and a admin as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryMan: inMemoryDeliveryManRepository.items[0],
    })
  })

  it('should hash delivery man password upon registration', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'Gabriel',
      email: 'gabriel@gmail.com',
      cpf: '08588107080',
      phone: '992837932',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    // expect success and a student as response
    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryManRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to register with same cpf twice', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const cpf = '123456'

    await sut.execute({
      adminId: admin.id.toString(),
      name: 'John',
      cpf,
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'John',
      cpf,
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    // expect the response be a error with an instance
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register with non existing admnistrator', async () => {
    const result = await sut.execute({
      adminId: 'non-existing',
      name: 'John',
      cpf: '123456',
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    // expect the response be a error with an instance
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
