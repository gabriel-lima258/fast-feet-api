import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/opcional'
import dayjs from 'dayjs'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ChangeStatusEvent } from '../events/change-status-event'
import { DeliveryAttachmentList } from './delivery-attachment-list'

export interface DeliveryProps {
  deliveryManId: UniqueEntityID
  recipientId: UniqueEntityID
  title: string
  status: string
  postedAt?: Date | null
  pickedUpAt?: Date | null
  returnedAt?: Date | null
  deliveredAt?: Date | null
  attachments: DeliveryAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get deliveryManId() {
    return this.props.deliveryManId
  }

  set deliveryManId(deliveryManId: UniqueEntityID) {
    this.props.deliveryManId = deliveryManId

    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId

    this.touch()
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()

    this.addDomainEvents(new ChangeStatusEvent(this, status))
  }

  get postedAt() {
    return this.props.postedAt
  }

  set postedAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get pickedUpAt() {
    return this.props.pickedUpAt
  }

  set pickedUpAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  set returnedAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  set deliveredAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachment: DeliveryAttachmentList) {
    this.props.attachments = attachment
    this.touch() // use when update a new content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, 'days') <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DeliveryProps, 'createdAt' | 'status' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const delivery = new Delivery(
      {
        ...props,
        status: props.status ?? '',
        attachments: props.attachments ?? new DeliveryAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return delivery
  }
}
