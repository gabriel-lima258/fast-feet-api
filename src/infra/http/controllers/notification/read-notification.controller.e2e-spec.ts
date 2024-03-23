import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AdminFactory } from 'test/factories/make-admin'
import { NotificationFactory } from 'test/factories/make-notification'
import { RecipientFactory } from 'test/factories/make-recipient'
import request from 'supertest'

describe('Read notification (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let notificationFactory: NotificationFactory
  let recipientFactory: RecipientFactory
  let administratorFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [NotificationFactory, RecipientFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    notificationFactory = moduleRef.get(NotificationFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    administratorFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/:recipientId/read', async () => {
    const user = await administratorFactory.makePrismaAdmin()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const notification = await notificationFactory.makePrismaNotification({
      content: 'Status do pedido mudou',
      recipientId: recipient.id,
    })

    const notificationId = notification.id.toString()
    const recipientId = recipient.id.toString()

    const result = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/${recipientId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(result.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
