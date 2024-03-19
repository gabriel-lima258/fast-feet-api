import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { ChangePasswordDeliverymanUseCase } from './change-password-delivery-man'
import { makeAdmin } from 'test/factories/make-admin'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'

let inMemoryAdministratorsRepository: InMemoryAdminRepository
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let fakeHasher: FakeHasher
let sut: ChangePasswordDeliverymanUseCase

describe('Change Password Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    inMemoryAdministratorsRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangePasswordDeliverymanUseCase(
      inMemoryAdministratorsRepository,
      inMemoryDeliveryManRepository,
      fakeHasher,
    )
  })

  it('should be able to change a password of an existing deliveryman', async () => {
    const administrator = makeAdmin()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      password: '123456789',
      confirmPassword: '123456789',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryManRepository.items[0]).toMatchObject({
      password: '123456789-hashed',
    })
  })

  it('should not be able to change a password with wrong confirm password', async () => {
    const administrator = makeAdmin()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      password: '123456789',
      confirmPassword: '1234567890',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to change a password with no authorization', async () => {
    const deliveryman = makeDeliveryMan()

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: 'non-existing',
      deliverymanId: deliveryman.id.toString(),
      password: '123456789',
      confirmPassword: '1234567890',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
