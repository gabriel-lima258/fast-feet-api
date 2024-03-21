import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'

export class DeliveryManPresenter {
  static toHTTP(deliveryman: DeliveryMan) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      email: deliveryman.email,
      cpf: deliveryman.cpf,
      phone: deliveryman.phone,
    }
  }
}
