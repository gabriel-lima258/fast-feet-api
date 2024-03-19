import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CreateAdminUseCase } from './create-admin'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher
let sut: CreateAdminUseCase // sut => system under test

describe('Create Admin Use Case', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateAdminUseCase(inMemoryAdminRepository, fakeHasher)
  })

  it('should be able to register an admin', async () => {
    const result = await sut.execute({
      name: 'Gabriel',
      email: 'gabriel@gmail.com',
      cpf: '08588107080',
      phone: '992837932',
      password: '123456',
    })

    // expect success and a admin as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminRepository.items[0],
    })
  })

  it('should hash admin password upon registration', async () => {
    const result = await sut.execute({
      name: 'Gabriel',
      email: 'gabriel@gmail.com',
      cpf: '08588107080',
      phone: '992837932',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    // expect success and a student as response
    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register with same cpf twice', async () => {
    const cpf = '123456'

    await sut.execute({
      name: 'John',
      cpf,
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const result = await sut.execute({
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
})
