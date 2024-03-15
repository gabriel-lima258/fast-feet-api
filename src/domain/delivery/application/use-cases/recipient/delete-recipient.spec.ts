import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { DeleteRecipientUseCase } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: DeleteRecipientUseCase // sut => system under test

describe('Delete Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository)
  })

  it('it should be able to delete a recipient', async () => {
    // create a new recipient before and adding an id manually
    const recipient = makeRecipient({}, new UniqueEntityID('recipient-1'))
    // now pass the new recipient into memory test
    await inMemoryRecipientRepository.create(recipient)

    await sut.execute({
      recipientId: 'recipient-1',
    })

    // expect the recipient to be deleted in memory
    expect(inMemoryRecipientRepository.items).toHaveLength(0)
  })
})
