import { FirebaseClient } from '@/clients/firebase'

const client = new FirebaseClient()

export class LogoutService {
  private client: FirebaseClient

  constructor() {
    this.client = client
  }

  async handle() {
    await this.client.getAuth().signOut()

    return
  }
}
