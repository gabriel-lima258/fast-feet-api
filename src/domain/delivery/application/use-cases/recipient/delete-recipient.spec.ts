import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { DeleteRecipientUseCase } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: DeleteRecipientUseCase // sut => system under test

describe('Delete Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new DeleteRecipientUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientRepository,
    )
  })

  it('it should be able to delete a recipient', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const recipient = makeRecipient()
    // now pass the new recipient into memory test
    await inMemoryRecipientRepository.create(recipient)

    await sut.execute({
      adminId: admin.id.toString(),
      recipientId: recipient.id.toString(),
    })

    // expect the recipient to be deleted in memory
    expect(inMemoryRecipientRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an existing recipient with non existing administrador', async () => {
    const admin = makeAdmin()

    inMemoryAdminRepository.items.push(admin)

    const recipient = makeRecipient()

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-existing',
      recipientId: recipient.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryRecipientRepository.items).toHaveLength(1)
  })
})
