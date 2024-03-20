import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Delete Delivery Man (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()

    // get prisma and jwt from inside the module
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /deliverymans/:id', async () => {
    // create user
    const admin = await adminFactory.makePrismaAdmin()

    // get its token
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan()

    const deliverymanId = deliveryman.id.toString()

    // create a new deliveryman
    const response = await request(app.getHttpServer())
      .delete(`/deliverymans/${deliverymanId}`)
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send()

    expect(response.statusCode).toBe(204)

    // verify if the deliveryman created is on database by id
    const deliverymanOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliverymanId,
      },
    })

    expect(deliverymanOnDatabase).toBeNull()
  })
})
