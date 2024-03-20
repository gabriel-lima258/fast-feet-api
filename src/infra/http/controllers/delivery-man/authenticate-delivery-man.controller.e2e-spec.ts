import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Authenticate DeliveryMan (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliveryManFactory

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryManFactory], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()

    // get prisma from inside the module
    deliverymanFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  test('[POST] /sessions/deliveryman', async () => {
    await deliverymanFactory.makePrismaDeliveryMan({
      cpf: '08507088021',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/deliveryman')
      .send({
        cpf: '08507088021',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
