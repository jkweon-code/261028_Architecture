// ─────────────────────────────────────────────────────────────
// 사이트 전체 설정: 이 파일 하나만 고치면 이름, 소개 문구, 색상이 바뀝니다.
// ─────────────────────────────────────────────────────────────

export const siteConfig = {
  // 헤더와 브라우저 탭에 표시되는 연구실 이름
  name: '건축설계연구실',
  // 영문 이름 (헤더 아래 작은 글씨)
  nameEn: 'Architectural Design Lab',
  // 소속
  affiliation: '○○대학교 건축학과',
  // 홈 화면 큰 제목 아래 소개 문구
  tagline: '도시와 건축, 그리고 사람 사이의 관계를 연구합니다.',
  intro:
    '본 연구실은 지속가능한 도시 주거, 디지털 설계 방법론, 건축 역사와 이론을 중심으로 연구와 교육을 수행합니다. ' +
    '설계 실무와 학술 연구를 연결하여, 실제 공간에 적용 가능한 지식을 만드는 것을 목표로 합니다.',

  // 포인트 색 (사이트 전체 강조색). 16진수 색상 코드로 바꾸세요.
  // 예) 남색 '#1e3a5f', 진녹색 '#2f5d50', 버건디 '#7a2e3a'
  accentColor: '#1e3a5f',

  // 푸터에 표시되는 연락처
  contact: {
    address: '서울특별시 ○○구 ○○로 00, ○○관 000호',
    email: 'professor@university.ac.kr',
    phone: '02-000-0000',
  },

  // 토론 게시판 글 분류. 순서대로 선택지에 표시됩니다.
  postCategories: ['연구토론', '질문', '자료공유', '공지'],
} as const;

export type PostCategory = (typeof siteConfig.postCategories)[number];

// 헤더 메뉴 (순서를 바꾸거나 이름을 바꿀 수 있습니다)
export const navItems = [
  { to: '/research', label: '연구' },
  { to: '/teaching', label: '수업자료' },
  { to: '/publications', label: '성과' },
  { to: '/discussion', label: '토론' },
  { to: '/people', label: '구성원' },
];
