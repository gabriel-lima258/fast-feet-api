import { RecipientFactory } from 'test/factories/make-recipient'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Fetch Nearby Deliveries (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let deliveryFactory: DeliveryFactory
  let deliverymanFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryFactory, DeliveryManFactory, RecipientFactory], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /deliveries/nearby', async () => {
    const deliveryMan = await deliverymanFactory.makePrismaDeliveryMan()
    const accessToken = jwt.sign({ sub: deliveryMan.id.toString() })

    // near recipient
    const recipient1 = await recipientFactory.makePrismaRecipient({
      latitude: -16.0053338,
      longitude: -47.9963359,
    })

    // far recipient
    const recipient2 = await recipientFactory.makePrismaRecipient({
      latitude: -15.6337207,
      longitude: -47.6455277,
    })

    await Promise.all([
      deliveryFactory.makePrismaDelivery({
        title: 'pacote 1',
        deliveryManId: deliveryMan.id,
        recipientId: recipient1.id,
        status: 'Returned',
      }),
      deliveryFactory.makePrismaDelivery({
        title: 'pacote 2',
        deliveryManId: deliveryMan.id,
        recipientId: recipient2.id,
        status: 'Waiting',
      }),
    ])

    // create a new deliveryman
    const response = await request(app.getHttpServer())
      .get(`/deliveries/nearby`)
      .query({
        latitude: -16.0053338,
        longitude: -47.9963359,
      })
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({
          title: 'pacote 1',
          status: 'Returned',
        }),
      ]),
    })
  })
})
