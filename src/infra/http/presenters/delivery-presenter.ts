import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

export class DeliveryPresenter {
  static toHTTP(delivery: Delivery) {
    return {
      id: delivery.id.toString(),
      title: delivery.title,
      recipientId: delivery.recipientId.toString(),
      deliveryManId: delivery.deliveryManId.toString(),
      status: delivery.status,
      postedAt: delivery.postedAt,
      pickedUpAt: delivery.pickedUpAt,
      returnedAt: delivery.returnedAt,
      deliveredAt: delivery.deliveredAt,
    }
  }
}
