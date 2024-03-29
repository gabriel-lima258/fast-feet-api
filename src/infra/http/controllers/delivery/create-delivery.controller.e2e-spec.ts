import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create Delivery (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliveryManFactory

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliveryManFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    // get prisma from inside the module
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('[POST] /recipients/:recipientId/deliveries', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const deliveryMan = await deliverymanFactory.makePrismaDeliveryMan()
    const recipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .post(`/deliveries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'pacote 1',
        deliverymanId: deliveryMan.id.toString(),
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    // verify if the user created is on database
    const deliveryOnDatabase = await prisma.delivery.findFirst({
      where: {
        title: 'pacote 1',
        userId: deliveryMan.id.toString(),
        recipientId: recipient.id.toString(),
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
  })
})
