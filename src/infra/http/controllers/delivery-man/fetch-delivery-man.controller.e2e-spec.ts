import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Fetch Delivery Man (E2E)', () => {
  let app: INestApplication
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

    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /deliverymans', async () => {
    // create user
    const admin = await adminFactory.makePrismaAdmin()

    // get its token
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    await Promise.all([
      deliverymanFactory.makePrismaDeliveryMan({
        name: 'Matheus',
        email: 'matheus58221@gmail.com',
        cpf: '08507088982',
        phone: '992632009',
      }),
      deliverymanFactory.makePrismaDeliveryMan({
        name: 'Gabriel',
        email: 'gabriel58221@gmail.com',
        cpf: '08507088981',
        phone: '992632009',
      }),
    ])

    // create a new deliveryman
    const response = await request(app.getHttpServer())
      .get(`/deliverymans`)
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliverymans: expect.arrayContaining([
        expect.objectContaining({
          name: 'Matheus',
          email: 'matheus58221@gmail.com',
          cpf: '08507088982',
          phone: '992632009',
        }),
        expect.objectContaining({
          name: 'Gabriel',
          email: 'gabriel58221@gmail.com',
          cpf: '08507088981',
          phone: '992632009',
        }),
      ]),
    })
  })
})
