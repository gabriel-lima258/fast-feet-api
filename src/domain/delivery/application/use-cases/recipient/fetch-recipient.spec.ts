import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeAdmin } from 'test/factories/make-admin'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { FetchRecipientUseCase } from './fetch-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAdminRepository: InMemoryAdminRepository
let sut: FetchRecipientUseCase

describe('Fetch Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAdminRepository = new InMemoryAdminRepository()
    sut = new FetchRecipientUseCase(
      inMemoryAdminRepository,
      inMemoryRecipientRepository,
    )
  })

  it('should be able to fetch recipient', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    await inMemoryRecipientRepository.create(makeRecipient())
    await inMemoryRecipientRepository.create(makeRecipient())
    await inMemoryRecipientRepository.create(makeRecipient())

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 1,
    })

    if (result.isRight()) {
      expect(result.value.recipient).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated recipient', async () => {
    const administrator = makeAdmin()

    inMemoryAdminRepository.items.push(administrator)

    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 2,
    })

    if (result.isRight()) {
      expect(result.value.recipient).toHaveLength(2)
    }
  })

  it('should not be able to fetch paginated recipient without administrator id', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      adminId: 'non-existing',
      page: 2,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
