import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { RegisterUserUseCase } from './register-user-use-case'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase // sut => system under test

describe('Register User Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to register a user', async () => {
    const result = await sut.execute({
      name: 'Gabriel',
      cpf: '08588107080',
      password: '123456',
      role: 'DELIVERY-MAN',
    })

    // expect success and a user as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUserRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'Gabriel',
      cpf: '08588107080',
      password: '123456',
      role: 'DELIVERY-MAN',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    // expect success and a student as response
    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toEqual(hashedPassword)
  })
})
