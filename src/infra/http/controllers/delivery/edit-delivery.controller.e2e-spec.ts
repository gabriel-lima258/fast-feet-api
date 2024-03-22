import { DeliveryFactory } from 'test/factories/make-delivery'
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

describe('Edit Delivery (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let deliverymanFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        DeliveryFactory,
        DeliveryManFactory,
        RecipientFactory,
      ], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()

    // get prisma and jwt from inside the module
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /deliveries/:id', async () => {
    // create user
    const admin = await adminFactory.makePrismaAdmin()

    // get its token
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const deliveryMan = await deliverymanFactory.makePrismaDeliveryMan()

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
    })

    const deliveryId = delivery.id.toString()

    // create a new delivery
    const response = await request(app.getHttpServer())
      .put(`/deliveries/${deliveryId}`)
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send({
        title: 'Pacote 2',
        deliverymanId: deliveryMan.id.toString(),
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    // verify if the deliveryman created is on database by id
    const deliveryOnDatabase = await prisma.delivery.findFirst({
      where: {
        title: 'Pacote 2',
        userId: deliveryMan.id.toString(),
        recipientId: recipient.id.toString(),
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
  })
})
