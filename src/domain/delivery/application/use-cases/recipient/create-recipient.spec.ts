import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CreateRecipientUseCase } from './create-recipient'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { RecipientAlreadyExistsError } from '../errors/recipient-already-exists-error'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: CreateRecipientUseCase // sut => system under test

describe('Create Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new CreateRecipientUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to craete a recipient', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'recipient',
      street: 'Street-1',
      number: '10',
      city: 'San Francisco',
      state: 'CA',
      cep: '72593210',
      latitude: -16.0053338,
      longitude: -47.9963359,
    })

    // expect success and a admin as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    })
  })

  it('should not be able to create with same cep twice', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const cep = '72593210'

    await sut.execute({
      adminId: admin.id.toString(),
      name: 'recipient',
      street: 'Street-1',
      number: '10',
      city: 'San Francisco',
      state: 'CA',
      cep,
      latitude: -16.0053338,
      longitude: -47.9963359,
    })

    const result = await sut.execute({
      adminId: admin.id.toString(),
      name: 'recipient',
      street: 'Street-1',
      number: '10',
      city: 'San Francisco',
      state: 'CA',
      cep,
      latitude: -16.0053338,
      longitude: -47.9963359,
    })

    // expect the response be a error with an instance
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RecipientAlreadyExistsError)
  })

  it('should not be able to register with non existing admnistrator', async () => {
    const result = await sut.execute({
      adminId: 'non-existing',
      name: 'recipient',
      street: 'Street-1',
      number: '10',
      city: 'San Francisco',
      state: 'CA',
      cep: '72593210',
      latitude: -16.0053338,
      longitude: -47.9963359,
    })

    // expect the response be a error with an instance
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
