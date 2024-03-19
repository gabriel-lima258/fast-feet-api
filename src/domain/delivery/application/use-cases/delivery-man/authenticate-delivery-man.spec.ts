import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryMan } from 'test/factories/make-delivery-man'
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-delivery-man-repository'
import { AuthenticateDeliveryManUseCase } from './authenticate-delivery-man'

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateDeliveryManUseCase // sut => system under test

describe('Authenticate DeliveryMan Use Case', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a delivery man', async () => {
    const deliveryman = makeDeliveryMan({
      cpf: '08507080881',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliveryManRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: '08507080881',
      password: '123456',
    })

    // expect success and a deliveryman as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
