import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { EditUserUseCase } from './edit-password-use-case'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: EditUserUseCase // sut => system under test

describe('Edit User Password Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new EditUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to edit a password from user', async () => {
    const user = makeUser({
      cpf: '08507080881',
      password: await fakeHasher.hash('123456'),
      role: 'ADMIN',
    })

    const newPassword = '1234567'

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: newPassword,
      role: 'ADMIN',
    })

    const hashedNewPassword = await fakeHasher.hash(newPassword)

    // expect success and a user as response
    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toEqual(hashedNewPassword)
  })

  it('should not be able to edit a password if it is not a admin', async () => {
    const user = makeUser({
      cpf: '08507080881',
      password: await fakeHasher.hash('123456'),
      role: 'ADMIN',
    })

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: user.password,
      role: 'DELIVERY-MAN',
    })

    // expect the response be a error with an instance
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
