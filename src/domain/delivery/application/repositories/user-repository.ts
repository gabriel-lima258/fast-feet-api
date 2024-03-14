import { User } from '../../enterprise/entities/user'

export abstract class UserRepository {
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
  abstract findById(id: string): Promise<User | null>
  abstract findByCPF(cpf: string): Promise<User | null>
}
