import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { EditRecipientUseCase } from './edit-recipient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: EditRecipientUseCase // sut => system under test

describe('Edit Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to edit a password from recipient', async () => {
    const recipient = makeRecipient({}, new UniqueEntityID('recipient-1'))

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toValue(),
      name: 'Gabriel Lima',
      email: 'gabriel58221@gmail.com',
      address: 'Qri 18 Casa 10',
      city: 'Gama',
      state: 'DF',
      cep: '72593210',
    })

    // expect success and a recipient as response
    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items[0]).toMatchObject({
      name: 'Gabriel Lima',
      email: 'gabriel58221@gmail.com',
      address: 'Qri 18 Casa 10',
      city: 'Gama',
      state: 'DF',
      cep: '72593210',
    })
  })

  it('should not be able to edit a recipient from different id', async () => {
    const recipient = makeRecipient({}, new UniqueEntityID('recipient-1'))

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      name: 'Gabriel Lima',
      email: 'gabriel58221@gmail.com',
      address: 'Qri 18 Casa 10',
      city: 'Gama',
      state: 'DF',
      cep: '72593210',
    })

    // expect the response be a error with an instance
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
