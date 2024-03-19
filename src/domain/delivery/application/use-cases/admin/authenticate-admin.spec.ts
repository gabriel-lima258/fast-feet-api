import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { AuthenticateAdminUseCase } from './authenticate-admin'
import { makeAdmin } from 'test/factories/make-admin'

let inMemoryAdminRepository: InMemoryAdminRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateAdminUseCase // sut => system under test

describe('Authenticate Admin Use Case', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a admin', async () => {
    const admin = makeAdmin({
      cpf: '08507080881',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      cpf: '08507080881',
      password: '123456',
    })

    // expect success and a admin as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
