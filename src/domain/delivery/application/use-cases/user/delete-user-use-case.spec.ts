import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository'
import { DeleteUserUseCase } from './delete-user-use-case'
import { makeUser } from 'test/factories/make-user'

let inMemoryUserRepository: InMemoryUserRepository
let sut: DeleteUserUseCase // sut => system under test

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new DeleteUserUseCase(inMemoryUserRepository)
  })

  it('it should be able to delete an user', async () => {
    // create a new user before and adding an id manually
    const newAnswer = makeUser({}, new UniqueEntityID('user-1'))
    // now pass the new user into memory test
    await inMemoryUserRepository.create(newAnswer)

    await sut.execute({
      userId: 'user-1',
    })

    // expect the user to be deleted in memory
    expect(inMemoryUserRepository.items).toHaveLength(0)
  })
})
