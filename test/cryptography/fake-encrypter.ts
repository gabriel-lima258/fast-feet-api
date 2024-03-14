import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  // Record is an object
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
