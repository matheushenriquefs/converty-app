import { doc, getDoc } from 'firebase/firestore'
import { FirebaseClient } from '@/clients/firebase'

const collection = 'conversions'
const client = new FirebaseClient()

export class ConversionRepository {
  private client: FirebaseClient

  constructor() {
    this.client = client
  }

  async get(path: string, ...paths: string[]) {
    const ref = doc(this.client.getDb(), collection, path, ...paths)
    const snapshot = await getDoc(ref)

    if (!snapshot.exists()) {
      return null
    }

    return snapshot
  }
}
