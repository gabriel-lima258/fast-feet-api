import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opcional'

export interface DeliveryManProps {
  name: string
  email: string
  cpf: string
  phone: string
  password: string
  createdAt: Date
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<DeliveryManProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliveryMan = new DeliveryMan(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return deliveryMan
  }
}
