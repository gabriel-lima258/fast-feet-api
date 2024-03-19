import { UseCaseError } from '@/core/errors/use-case-error'

export class NotCompleteDeliveryError extends Error implements UseCaseError {
  constructor() {
    super('Delivery has not been completed to be deleted!')
  }
}
