import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase // sut => system under test

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      cpf: '08507080881',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUserRepository.items.push(user)

    const result = await sut.execute({
      cpf: '08507080881',
      password: '123456',
    })

    // expect success and a user as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
