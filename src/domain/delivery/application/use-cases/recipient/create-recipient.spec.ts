import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { CreateRecipientUseCase } from './create-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase // sut => system under test

describe('Create Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to register a recipient', async () => {
    const result = await sut.execute({
      name: 'Gabriel Lima',
      email: 'gabriel58221@gmail.com',
      address: 'Qri 18 Casa 10',
      city: 'Gama',
      state: 'DF',
      cep: '72593210',
    })

    // expect success and a recipient as response
    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    })
    expect(inMemoryRecipientRepository.items[0].email).toEqual(
      'gabriel58221@gmail.com',
    )
  })
})
