import { Timestamp } from 'firebase/firestore';

/** Firestore Timestamp → 화면에서 쓰는 ISO 날짜 문자열 */
export function toIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  // 방금 쓴 글처럼 서버 시간이 아직 확정되지 않은 경우
  return new Date().toISOString();
}
