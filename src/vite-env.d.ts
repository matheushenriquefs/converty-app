/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CONVERTY_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
