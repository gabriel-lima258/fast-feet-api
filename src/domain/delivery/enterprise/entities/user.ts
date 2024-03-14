import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opcional'

type UserRole = 'ADMIN' | 'DELIVERY-MAN'

export interface UserProps {
  name: string
  cpf: string
  password: string
  role: UserRole
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get role() {
    return this.props.role
  }

  set role(role: UserRole) {
    this.props.role = role
  }

  static create(props: Optional<UserProps, 'role'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        role: props.role ?? 'DELIVERY-MAN',
      },
      id,
    )

    return user
  }
}
