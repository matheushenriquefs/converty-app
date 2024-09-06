import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { FirebaseClient } from '@/clients/firebase'

const client = new FirebaseClient()

export class LoginService {
  private client: FirebaseClient

  constructor() {
    this.client = client
  }

  async handle(email: string, password: string) {
    await setPersistence(this.client.getAuth(), browserSessionPersistence)
    await signInWithEmailAndPassword(this.client.getAuth(), email, password)
    window.location.replace('/')

    return
  }
}
