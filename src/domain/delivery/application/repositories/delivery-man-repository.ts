import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveryMan } from '../../enterprise/entities/deliveryman'

export abstract class DeliveryManRepository {
  abstract create(deliveryMan: DeliveryMan): Promise<void>
  abstract save(deliveryMan: DeliveryMan): Promise<void>
  abstract delete(deliveryMan: DeliveryMan): Promise<void>
  abstract findById(id: string): Promise<DeliveryMan | null>
  abstract findByCPF(cpf: string): Promise<DeliveryMan | null>
  abstract findByEmail(email: string): Promise<DeliveryMan | null>
  abstract findMany(params: PaginationParams): Promise<DeliveryMan[]>
}
