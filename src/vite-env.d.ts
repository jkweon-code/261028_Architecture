/// <reference types="vite/client" />

// .env 의 Firebase 설정값 이름 (자동 완성과 오타 방지용)
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_FIREBASE_EMULATOR?: string; // 개발자용
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
