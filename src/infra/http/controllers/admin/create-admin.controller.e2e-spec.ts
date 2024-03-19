import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Admin (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    // module to start server without the official server
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    // get prisma from inside the module
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /admins', async () => {
    const response = await request(app.getHttpServer()).post('/admins').send({
      name: 'Gabriel',
      email: 'gabriel58221@gmail.com',
      cpf: '08507088981',
      password: '123456',
      phone: '992632009',
    })

    expect(response.statusCode).toBe(201)

    // verify if the user created is on database
    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '08507088981',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
