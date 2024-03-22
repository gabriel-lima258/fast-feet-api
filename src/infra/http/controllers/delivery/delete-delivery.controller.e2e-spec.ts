import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Delete Delivery (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliveryFactory: DeliveryFactory
  let recipientFactory: RecipientFactory
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
    deliveryFactory = moduleRef.get(DeliveryFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /deliveries/:id', async () => {
    // create user
    const admin = await adminFactory.makePrismaAdmin()

    // get its token
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const deliveryMan = await deliverymanFactory.makePrismaDeliveryMan()

    const recipient = await recipientFactory.makePrismaRecipient()

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId: deliveryMan.id,
      recipientId: recipient.id,
    })

    const deliveryId = delivery.id.toString()

    // create a new delivery
    const response = await request(app.getHttpServer())
      .delete(`/deliveries/${deliveryId}`)
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send()

    expect(response.statusCode).toBe(204)

    // verify if the delivery created is on database by id
    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    expect(deliveryOnDatabase).toBeNull()
  })
})
