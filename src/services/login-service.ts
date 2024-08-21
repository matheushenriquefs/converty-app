import {
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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
    const { user } = await signInWithEmailAndPassword(
      this.client.getAuth(),
      email,
      password
    )
    sessionStorage.setItem('firebase:authUser', JSON.stringify(user.toJSON()))

    onAuthStateChanged(this.client.getAuth(), (user) => {
      if (!user) {
        window.location.href = '/sign-in'
      }
    })

    window.location.href = '/'
  }
}
