import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Authenticate Admin (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()

    // get prisma from inside the module
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /sessions/admin', async () => {
    await adminFactory.makePrismaAdmin({
      cpf: '08507088021',
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
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
