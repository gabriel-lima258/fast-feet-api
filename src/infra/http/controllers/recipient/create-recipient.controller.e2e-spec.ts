import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    // get prisma from inside the module
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /recipients', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
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

    expect(response.statusCode).toBe(201)

    // verify if the user created is on database
    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'recipient',
        street: 'Street-1',
        number: '10',
        city: 'San Francisco',
        state: 'CA',
        cep: '72593210',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
