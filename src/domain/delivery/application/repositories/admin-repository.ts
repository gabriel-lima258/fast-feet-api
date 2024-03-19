import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>
  abstract save(admin: Admin): Promise<void>
  abstract delete(admin: Admin): Promise<void>
  abstract findById(id: string): Promise<Admin | null>
  abstract findByCPF(cpf: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
}
