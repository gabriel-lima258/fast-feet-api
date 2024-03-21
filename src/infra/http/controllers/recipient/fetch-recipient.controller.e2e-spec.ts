import { RecipientFactory } from 'test/factories/make-recipient'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Fetch Recipients (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /recipients', async () => {
    // create user
    const admin = await adminFactory.makePrismaAdmin()

    // get its token
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    await Promise.all([
      recipientFactory.makePrismaRecipient({
        name: 'recipient 1',
        street: 'Street-1',
        number: '10',
        city: 'San Francisco',
        state: 'CA',
        cep: '72593210',
        latitude: -16.0053338,
        longitude: -47.9963359,
      }),
      recipientFactory.makePrismaRecipient({
        name: 'recipient 2',
        street: 'Street-2',
        number: '10',
        city: 'Sao paulo',
        state: 'SP',
        cep: '72593440',
        latitude: -16.0053328,
        longitude: -47.9963159,
      }),
    ])

    // create a new deliveryman
    const response = await request(app.getHttpServer())
      .get(`/recipients`)
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({
          name: 'recipient 1',
          street: 'Street-1',
          number: '10',
          city: 'San Francisco',
          state: 'CA',
          cep: '72593210',
          latitude: -16.0053338,
          longitude: -47.9963359,
        }),
        expect.objectContaining({
          name: 'recipient 2',
          street: 'Street-2',
          number: '10',
          city: 'Sao paulo',
          state: 'SP',
          cep: '72593440',
          latitude: -16.0053328,
          longitude: -47.9963159,
        }),
      ]),
    })
  })
})
