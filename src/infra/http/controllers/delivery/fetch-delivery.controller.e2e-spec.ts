import { RecipientFactory } from 'test/factories/make-recipient'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Fetch Deliveries (E2E)', () => {
  let app: INestApplication
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

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /deliveries', async () => {
    // create user
    const admin = await adminFactory.makePrismaAdmin()

    // get its token
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const deliveryMan = await deliverymanFactory.makePrismaDeliveryMan()
    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      deliveryFactory.makePrismaDelivery({
        title: 'pacote 1',
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
        status: 'Returned',
      }),
      deliveryFactory.makePrismaDelivery({
        title: 'pacote 2',
        deliveryManId: deliveryMan.id,
        recipientId: recipient.id,
        status: 'Waiting',
      }),
    ])

    // create a new deliveryman
    const response = await request(app.getHttpServer())
      .get(`/deliveries`)
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({
          title: 'pacote 1',
          status: 'Returned',
        }),
        expect.objectContaining({
          title: 'pacote 2',
          status: 'Waiting',
        }),
      ]),
    })
  })
})
