import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'
import { DomainEvents } from '@/core/events/domain-events'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { DeliveryFactory } from 'test/factories/make-delivery'

describe('Send notification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliveryFactory: DeliveryFactory
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliveryManFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliveryFactory, RecipientFactory, DeliveryManFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    deliveryFactory = moduleRef.get(DeliveryFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when status changes', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan()
    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId: deliveryman.id,
      recipientId: recipient.id,
    })

    const deliveryId = delivery.id.toString()

    await request(app.getHttpServer())
      .post(`/deliveries/${deliveryId}/returned`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
