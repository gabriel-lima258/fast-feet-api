import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Mark Delivery Picked Up (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliveryManFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryFactory, DeliveryManFactory, RecipientFactory], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('[PATCH] /deliveries/:deliveryId/pickedup', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan()
    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId: deliveryman.id,
      recipientId: recipient.id,
    })

    const deliveryId = delivery.id.toString()

    const result = await request(app.getHttpServer())
      .patch(`/deliveries/${deliveryId}/pickedup`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(result.statusCode).toBe(204)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
    expect(deliveryOnDatabase?.status).toEqual('Picked up')
  })
})
