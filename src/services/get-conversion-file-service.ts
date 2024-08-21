import { ref, getDownloadURL } from 'firebase/storage'
import {
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'

import { FirebaseClient } from '@/clients/firebase'

const client = new FirebaseClient()

export class GetConversionFileService {
  private client: FirebaseClient
  private collection: string

  constructor() {
    this.client = client
    this.collection = 'conversions'
  }

  async handle(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>) {
    const storage = this.client.getStorage()
    const { pathname } = new URL(snapshot.get('url'))
    const filename = pathname.substring(pathname.lastIndexOf('/') + 1)
    const path = [this.collection, '/' + filename].join('')
    const downloadUrl = await getDownloadURL(ref(storage, path))
    const response = await fetch(downloadUrl)

    if (!response) {
      return null
    }

    const blob = await response.blob()

    return new File([blob], filename, {
      type: blob.type,
    })
  }
}
