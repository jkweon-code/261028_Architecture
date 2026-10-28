// ─────────────────────────────────────────────────────────────
// 논문 및 발표(성과) 데이터
//
// [작성법]
// - 항목 하나가 { ... } 블록 하나입니다. 순서는 상관없습니다 (화면에서 연도순으로 자동 정렬).
// - id 는 다른 항목과 겹치지 않는 아무 영문/숫자 (예: 'p2026-01')
// - type 은 아래 중 하나입니다:
//     'journal'(학술지 논문) | 'conference'(학회 발표) | 'book'(저서) | 'report'(보고서) | 'exhibition'(전시)
// - url 은 DOI 또는 원문 링크입니다. 없으면 줄 전체를 지워도 됩니다.
// ─────────────────────────────────────────────────────────────

import type { Publication, PublicationType } from '../types';

export const publications: Publication[] = [
  {
    id: 'p2026-01',
    type: 'journal',
    year: 2026,
    title: '저층 주거지 재생 과정에서 나타난 공동주거 공용공간의 유형과 이용 특성',
    authors: '홍길동, 김연구',
    venue: '대한건축학회논문집 계획계, 42(3)',
    url: 'https://doi.org/',
  },
  {
    id: 'p2026-02',
    type: 'conference',
    year: 2026,
    title: 'Environmental Data in Early-Stage Design Studios',
    authors: 'G. Hong, S. Lee',
    venue: 'CAADRIA 2026',
  },
  {
    id: 'p2025-01',
    type: 'journal',
    year: 2025,
    title: '설계 스튜디오에서 환경 분석 도구 활용이 대안 탐색에 미치는 영향',
    authors: '이설계, 홍길동',
    venue: '한국실내디자인학회논문집, 34(2)',
    url: 'https://doi.org/',
  },
  {
    id: 'p2024-01',
    type: 'book',
    year: 2024,
    title: '도시의 집: 서울 공동주거 30년',
    authors: '홍길동',
    venue: '○○출판사',
  },
  {
    id: 'p2023-01',
    type: 'exhibition',
    year: 2023,
    title: '근대의 재료들: 1950–70 건축 아카이브전',
    authors: '건축설계연구실',
    venue: '○○대학교 박물관',
  },
  {
    id: 'p2023-02',
    type: 'report',
    year: 2023,
    title: '한국 근대 건축물 재료·구법 기록화 연구 최종보고서',
    authors: '홍길동 외',
    venue: '○○재단',
  },
];

/** 유형별 한글 이름 (필터 버튼과 목록에 표시) */
export const publicationTypeLabels: Record<PublicationType, string> = {
  journal: '학술지 논문',
  conference: '학회 발표',
  book: '저서',
  report: '보고서',
  exhibition: '전시',
};
