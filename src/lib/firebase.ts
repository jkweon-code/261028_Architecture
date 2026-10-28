// ─────────────────────────────────────────────────────────────
// Firebase 초기화
// 설정값은 환경변수(VITE_FIREBASE_*)에서 읽습니다.
//  - 내 컴퓨터: 프로젝트 폴더의 .env 파일
//  - Netlify: Site configuration → Environment variables
// 사용하는 기능: Authentication(Google 로그인), Cloud Firestore 만 (Spark 무료 요금제)
// ─────────────────────────────────────────────────────────────

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, initializeFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** 설정값이 들어 있는지. false 이면 로그인·토론 기능이 꺼진 채로 나머지 페이지만 동작 */
export const firebaseReady = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseReady) {
  app = initializeApp(config);
  auth = getAuth(app);
  // undefined 값(예: 관련 연구를 고르지 않음)은 저장할 때 자동으로 빼도록 설정
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });

  // (개발자용) .env.local 에 VITE_FIREBASE_EMULATOR=true 를 넣으면 실제 Firebase 대신 내 컴퓨터의 에뮬레이터에 연결
  if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATOR === 'true') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
} else if (import.meta.env.DEV) {
  console.warn('[firebase] .env 에 VITE_FIREBASE_* 값이 없어 로그인과 토론 기능이 꺼져 있습니다. README 를 참고하세요.');
}

export function requireAuth(): Auth {
  if (!auth) throw new Error('Firebase 설정값(VITE_FIREBASE_*)이 없습니다.');
  return auth;
}

export function requireDb(): Firestore {
  if (!db) throw new Error('Firebase 설정값(VITE_FIREBASE_*)이 없습니다.');
  return db;
}
