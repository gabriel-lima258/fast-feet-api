import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Notification } from '../../enterprise/entities/notification'

import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NotificationRepository } from '../repositories/notication-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    // fuction the read notification
    notification.read()

    // save the notification in the notification repository
    await this.notificationRepository.save(notification)

    return right({
      notification,
    })
  }
}
