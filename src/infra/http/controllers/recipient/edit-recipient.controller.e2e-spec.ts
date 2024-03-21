import { RecipientFactory } from 'test/factories/make-recipient'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Edit Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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

    // get prisma and jwt from inside the module
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /recipients/:id', async () => {
    // create user
    const admin = await adminFactory.makePrismaAdmin()

    // get its token
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const recipientId = recipient.id.toString()

    // create a new recipient
    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`) // set authorization
      .send({
        name: 'recipient',
        street: 'Street-1',
        number: '10',
        city: 'San Francisco',
        state: 'CA',
        cep: '72593210',
        latitude: -16.0053338,
        longitude: -47.9963359,
      })

    expect(response.statusCode).toBe(204)

    // verify if the deliveryman created is on database by id
    const deliverymanOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'recipient',
        street: 'Street-1',
        number: '10',
        city: 'San Francisco',
        state: 'CA',
        cep: '72593210',
        latitude: -16.0053338,
        longitude: -47.9963359,
      },
    })

    expect(deliverymanOnDatabase).toBeTruthy()
  })
})
