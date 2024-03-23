import { PaginationParams } from '@/core/repositories/pagination-params'
import {
  DeliveryRepository,
  FindManyNearbyParams,
} from '@/domain/delivery/application/repositories/delivery-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { Injectable } from '@nestjs/common'
import { PrismaDeliveryMapper } from '../mappers/prisma-delivery-mapper'
import { PrismaService } from '../prisma.service'
import { Recipient } from '@prisma/client'
import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaDeliveryRepository implements DeliveryRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private deliveryAttachmentsRepository: DeliveryAttachmentsRepository,
  ) {}

  async create(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.create({
      data,
    })
  }

  async delete(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.update({
      where: {
        id: data.id,
      },
      data,
    })

    await this.cache.delete(`delivery:${data.id}:details`)

    DomainEvents.dispatchEventsForAggregate(delivery.id)

    if (
      delivery.status === 'Delivered' &&
      delivery.attachments !== null &&
      delivery.attachments !== undefined
    ) {
      await this.deliveryAttachmentsRepository.createMany(
        delivery.attachments.getItems(),
      )
    }
  }

  async findById(id: string): Promise<Delivery | null> {
    const cacheHit = await this.cache.get(`delivery:${id}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const delivery = await this.prisma.delivery.findUnique({
      where: {
        id,
      },
    })

    if (!delivery) {
      return null
    }

    const deliveryDetails = PrismaDeliveryMapper.toDomain(delivery)

    await this.cache.set(
      `delivery:${id}:details`,
      JSON.stringify(deliveryDetails),
    )

    return deliveryDetails
  }

  async findMany({ page }: PaginationParams): Promise<Delivery[]> {
    const delivery = await this.prisma.delivery.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return delivery.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyByDeliveryManId(
    id: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const delivery = await this.prisma.delivery.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return delivery.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyByDeliveryManAndNearby(
    id: string,
    { page, latitude, longitude }: FindManyNearbyParams,
  ): Promise<Delivery[]> {
    const nearbyRecipients = await this.prisma.$queryRaw<Recipient[]>`
    SELECT * FROM recipients 
    WHERE (6371 * acos(
      cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) +
      sin(radians(${latitude})) * sin(radians(latitude))
    )) <= 0.5`

    const nearbyOrders = await this.prisma.delivery.findMany({
      where: {
        userId: id,
        recipientId: {
          in: nearbyRecipients.map((recipient) => recipient.id),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return nearbyOrders.map((delivery) =>
      PrismaDeliveryMapper.toDomain(delivery),
    )
  }
}
