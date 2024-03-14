import { HashComparer } from '@/domain/delivery/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  // set the password string and concat with -hashed
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  // if the password is equal to hashed password
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
