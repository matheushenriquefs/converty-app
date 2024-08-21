import { initializeApp } from 'firebase/app'
import { type Auth, getAuth } from 'firebase/auth'
import { type Firestore, getFirestore } from 'firebase/firestore'
import { type FirebaseStorage, getStorage } from 'firebase/storage'

import { firebaseConfig } from '@/config/firebase'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export class FirebaseClient {
  private auth: Auth
  private db: Firestore
  private storage: FirebaseStorage

  constructor() {
    this.auth = auth
    this.db = db
    this.storage = storage
  }

  getAuth() {
    return this.auth
  }

  getDb() {
    return this.db
  }

  getStorage() {
    return this.storage
  }
}
