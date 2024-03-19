import { makeAdmin } from 'test/factories/make-admin'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { EditRecipientUseCase } from './edit-recipient'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new EditRecipientUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to edit an existing recipient', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'John',
      street: 'Rua do teste',
      number: '123AD',
      city: 'CWB',
      state: 'PR',
      cep: '72953210',
      latitude: 123457.8,
      longitude: 45678.8,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items[0]).toMatchObject({
      name: 'John',
      cep: '72953210',
    })
  })

  it('should not be able to delete an existing recipient with non existing administrador', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-existing',
      recipientId: recipient.id.toString(),
      name: 'John',
      street: 'Rua do teste',
      number: '123AD',
      city: 'CWB',
      state: 'PR',
      cep: '72953210',
      latitude: 123457.8,
      longitude: 45678.8,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
  })
})
