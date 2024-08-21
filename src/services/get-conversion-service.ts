import { ConversionRepository } from '@/repositories/conversion-repository'

export class GetConversionService {
  private repository: ConversionRepository

  constructor() {
    this.repository = new ConversionRepository()
  }

  async handle(
    url: string,
    payload: {
      sourceUrl: string
    }
  ) {
    if (!url) {
      return null
    }

    const response = await fetch(
      import.meta.env.VITE_APP_CONVERTY_API_URL + '/conversions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      return null
    }

    const conversion = await response.json()

    return await this.repository.get(conversion.id)
  }
}
