import { PaginationParams } from '@/core/repositories/pagination-params'
import { Delivery } from '../../enterprise/entities/delivery'

export type FindManyNearbyParams = PaginationParams & {
  latitude: number
  longitude: number
}

export abstract class DeliveryRepository {
  abstract create(delivery: Delivery): Promise<void>
  abstract delete(delivery: Delivery): Promise<void>
  abstract save(delivery: Delivery): Promise<void> // edit method
  abstract findById(id: string): Promise<Delivery | null>
  abstract findMany(params: PaginationParams): Promise<Delivery[]>
  abstract findManyByDeliveryManId(
    id: string,
    params: PaginationParams,
  ): Promise<Delivery[]>

  abstract findManyByDeliveryManAndNearby(
    id: string,
    params: FindManyNearbyParams,
  ): Promise<Delivery[]>
}
