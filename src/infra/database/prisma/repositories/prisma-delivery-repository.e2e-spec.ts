import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { RecipientFactory } from 'test/factories/make-recipient'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DeliveryRepository } from '@/domain/delivery/application/repositories/delivery-repository'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliveryManFactory } from 'test/factories/make-delivery-man'

describe('Prisma Delivery Repository (E2E)', () => {
  let app: INestApplication
  let deliveryFactory: DeliveryFactory
  let recipientFactory: RecipientFactory
  let cacheRepository: CacheRepository
  let deliveryRepository: DeliveryRepository
  let deliverymanFactory: DeliveryManFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        DeliveryFactory,
        AdminFactory,
        DeliveryManFactory,
        RecipientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    deliveryFactory = moduleRef.get(DeliveryFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    deliveryRepository = moduleRef.get(DeliveryRepository)
    deliverymanFactory = moduleRef.get(DeliveryManFactory)

    await app.init()
  })

  it('should cache delivery details', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan()
    const deliveryManId = deliveryman.id

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId,
      recipientId,
      status: 'Pedido-01',
      title: 'Pedido-01',
    })

    const deliveryId = delivery.id.toString()

    const deliveryDetails = await deliveryRepository.findById(deliveryId)

    const cached = await cacheRepository.get(`delivery:${deliveryId}:details`)

    expect(cached).toEqual(JSON.stringify(deliveryDetails))
  })

  it('should return cached delivery details on subsequent calls', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan()
    const deliveryManId = deliveryman.id

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId,
      recipientId,
      status: 'Pedido-01',
      title: 'Pedido-01',
    })

    const deliveryId = delivery.id.toString()

    await cacheRepository.set(
      `delivery:${deliveryId}:details`,
      JSON.stringify({ empty: true }),
    )

    const deliveryDetails = await deliveryRepository.findById(deliveryId)

    expect(deliveryDetails).toEqual({ empty: true })
  })

  it('should reset delivery details cache when saving the delivery', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryMan()
    const deliveryManId = deliveryman.id

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id

    const delivery = await deliveryFactory.makePrismaDelivery({
      deliveryManId,
      recipientId,
      status: 'Pedido-01',
      title: 'Pedido-01',
    })

    const deliveryId = delivery.id.toString()

    await cacheRepository.set(
      `delivery:${deliveryId}:details`,
      JSON.stringify({ empty: true }),
    )

    await deliveryRepository.save(delivery)

    const cached = await cacheRepository.get(`delivery:${deliveryId}:details`)

    expect(cached).toBeNull()
  })
})
