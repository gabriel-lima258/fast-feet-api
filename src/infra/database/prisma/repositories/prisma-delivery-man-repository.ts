import { Injectable } from '@nestjs/common'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { PrismaService } from '../prisma.service'
import { DeliveryManRepository } from '@/domain/delivery/application/repositories/delivery-man-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveryMan } from '@/domain/delivery/enterprise/entities/deliveryman'
import { PrismaDeliveryManMapper } from '../mappers/prisma-delivery-man-mapper'

@Injectable()
export class PrismaDeliveryManRepository implements DeliveryManRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(deliveryMan)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(deliveryMan)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(deliveryMan)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryMan) {
      return null
    }

    // convertion prisma deliveryMan to domain deliveryMan
    return PrismaAdminMapper.toDomain(deliveryMan)
  }

  async findByCPF(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryMan) {
      return null
    }

    // convertion prisma deliveryMan to domain deliveryMan
    return PrismaAdminMapper.toDomain(deliveryMan)
  }

  async findByEmail(email: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!deliveryMan) {
      return null
    }

    // convertion prisma deliveryMan to domain deliveryMan
    return PrismaAdminMapper.toDomain(deliveryMan)
  }

  async findMany({ page }: PaginationParams): Promise<DeliveryMan[]> {
    const deliveryMans = await this.prisma.user.findMany({
      where: {
        role: 'DELIVERY_MAN',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return deliveryMans.map(PrismaDeliveryManMapper.toDomain)
  }
}
