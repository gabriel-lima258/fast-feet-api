import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { Admin } from '@/domain/delivery/enterprise/entities/admin'
import { Injectable } from '@nestjs/common'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data,
    })
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!admin) {
      return null
    }
    // convertion prisma admin to domain admin
    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!admin) {
      return null
    }

    // convertion prisma admin to domain admin
    return PrismaAdminMapper.toDomain(admin)
  }

  async findByCPF(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!admin) {
      return null
    }

    // convertion prisma admin to domain admin
    return PrismaAdminMapper.toDomain(admin)
  }
}
