import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Mark Delivery Completed (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let attachmentFactory: AttachmentFactory
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliveryManFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliveryFactory,
        DeliveryManFactory,
        RecipientFactory,
        AttachmentFactory,
      ], // get factory instance
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    recipientFactory = moduleRef.get(RecipientFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)

    await app.init()
  })

  test('[PATCH] /deliveries/:deliveryId/delivered', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan()
    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const attachment = await attachmentFactory.makePrismaAttachment()

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId: deliveryman.id,
      recipientId: recipient.id,
    })

    const deliveryId = delivery.id.toString()

    const result = await request(app.getHttpServer())
      .patch(`/deliveries/${deliveryId}/delivered`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachments: [attachment.id.toString()],
      })

    expect(result.statusCode).toBe(204)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
    expect(deliveryOnDatabase?.status).toEqual('Delivered')

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        deliveryId: deliveryOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(1)
  })
})
