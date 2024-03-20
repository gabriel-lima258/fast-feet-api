import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create Delivery Man (E2E)', () => {
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

  test('[POST] /deliverymans', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/deliverymans')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Matheus',
        email: 'matheus58221@gmail.com',
        cpf: '08507088982',
        password: '123456',
        phone: '992632009',
      })

    expect(response.statusCode).toBe(201)

    // verify if the user created is on database
    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '08507088982',
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.name).toEqual('Matheus')
  })
})
