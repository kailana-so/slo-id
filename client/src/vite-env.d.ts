/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_MEASUREMENT_ID: string
  readonly VITE_AWS_REGION: string
  readonly VITE_IMAGE_BUCKET: string
  readonly VITE_X_SYSTEM_KEY: string
  readonly VITE_ALA_OCCURANCE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
