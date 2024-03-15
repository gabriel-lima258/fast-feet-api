import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { GetRecipientByEmailUseCase } from './get-recipient-by-cep'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: GetRecipientByEmailUseCase // sut => system under test

describe('Get Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new GetRecipientByEmailUseCase(inMemoryRecipientRepository)
  })

  it('it should be able to get a recipient by cep', async () => {
    const recipient = makeRecipient({ cep: '72593210' })

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      cep: '72593210',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    })
    expect(inMemoryRecipientRepository.items[0].cep).toEqual('72593210')
  })
})
