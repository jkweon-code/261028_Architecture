// ─────────────────────────────────────────────────────────────
// 사이트에서 쓰는 데이터의 모양(타입) 정의
// 2단계(Firestore)에서도 같은 타입을 그대로 사용합니다.
// ─────────────────────────────────────────────────────────────

import type { PostCategory } from '../config/site';

/** 외부 링크 또는 public/files/ 정적 파일 링크 */
export interface LinkItem {
  label: string;
  url: string;
}

/** 연구 프로젝트 */
export interface Research {
  id: string; // 주소에 쓰이는 영문 식별자 (예: 'urban-housing')
  title: string;
  summary: string; // 카드에 보이는 한두 줄 설명
  period: string; // 예: '2024 – 현재'
  status: 'ongoing' | 'completed';
  keywords: string[];
  overview: string; // 개요
  methods: string; // 연구 방법
  results: string; // 결과 요약
  links: LinkItem[]; // 관련 링크
  featured?: boolean; // true 이면 홈 화면 "주요 연구 분야"에 표시
}

/** 수업 자료 링크 */
export interface CourseMaterial {
  week?: string; // 예: '1주차'
  title: string;
  url: string;
  type: 'slide' | 'reading' | 'assignment' | 'video' | 'etc';
}

/** 과목 */
export interface Course {
  id: string;
  code: string; // 학수번호
  title: string;
  semester: string; // 예: '2026-2학기'
  level: 'undergraduate' | 'graduate';
  summary: string;
  overview: string; // 강의 개요
  materials: CourseMaterial[];
}

/** 논문 및 발표 */
export type PublicationType = 'journal' | 'conference' | 'book' | 'report' | 'exhibition';

export interface Publication {
  id: string;
  type: PublicationType;
  year: number;
  title: string;
  authors: string; // 예: '홍길동, 김연구'
  venue: string; // 학술지명, 학회명, 출판사 등
  url?: string; // DOI 또는 원문 링크
}

/** 구성원 */
export type MemberRole = 'professor' | 'phd' | 'master' | 'researcher' | 'alumni';

export interface Member {
  id: string;
  name: string;
  nameEn?: string;
  role: MemberRole;
  title?: string; // 예: '교수', '박사과정 3학기'
  email?: string;
  photo?: string; // public/ 기준 경로 또는 외부 이미지 주소. 없으면 이니셜 표시
  interests: string[];
  bio?: string;
}

/** 로그인 사용자 (2단계에서 Firestore users/{uid} 문서와 대응) */
export type UserRole = 'admin' | 'member' | 'pending';

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string; // ISO 날짜 문자열
}

/** 토론 글 */
export interface Post {
  id: string;
  title: string;
  body: string;
  category: PostCategory;
  relatedResearchId?: string; // 연결된 연구 프로젝트 id (선택)
  authorUid: string;
  authorName: string;
  createdAt: string; // ISO 날짜 문자열
  updatedAt: string;
}

/** 글을 새로 쓰거나 고칠 때 화면에서 넘기는 값 */
export interface PostInput {
  title: string;
  body: string;
  category: PostCategory;
  relatedResearchId?: string;
}

/** 댓글 */
export interface Comment {
  id: string;
  postId: string;
  body: string;
  authorUid: string;
  authorName: string;
  createdAt: string;
}
