// ─────────────────────────────────────────────────────────────
// 연구 프로젝트 데이터
//
// [작성법]
// - 새 연구를 추가하려면 아래 목록에 { ... } 블록 하나를 복사해 붙여 넣고 내용을 고치세요.
// - id 는 주소에 쓰이므로 영문 소문자와 하이픈(-)만 쓰고, 다른 연구와 겹치지 않게 하세요.
//   예) id: 'smart-housing' → 사이트주소/research/smart-housing
// - status 는 'ongoing'(진행 중) 또는 'completed'(완료) 중 하나입니다.
// - featured: true 로 두면 홈 화면 "주요 연구 분야" 카드에 나옵니다.
// - 여러 줄 문장은 백틱(`)으로 감싸면 줄바꿈이 그대로 표시됩니다.
// - 블록 사이에는 쉼표(,)가 꼭 있어야 합니다.
// ─────────────────────────────────────────────────────────────

import type { Research } from '../types';

export const researchList: Research[] = [
  {
    id: 'urban-housing',
    title: '고밀 도시의 지속가능한 공동주거 유형 연구',
    summary: '서울 도심 저층 주거지의 재생 과정에서 나타나는 새로운 공동주거 유형을 분석합니다.',
    period: '2024 – 현재',
    status: 'ongoing',
    keywords: ['공동주거', '도시재생', '주거유형'],
    featured: true,
    overview: `서울 도심의 저층 주거지는 재개발과 소규모 정비사업을 거치며 빠르게 변하고 있습니다.
본 연구는 이 과정에서 등장하는 다양한 공동주거 유형을 수집하고, 밀도·공용공간·가로와의 관계를 기준으로 분류합니다.`,
    methods: `1) 2015–2025년 준공 사례 120여 건 도면 수집 및 유형 분류
2) 대표 사례 12곳 현장 조사 및 거주자 인터뷰
3) 공용공간 이용 행태 관찰 조사`,
    results: `중간 결과로 6개의 유형군을 도출했으며, 공용공간이 가로에 면할수록 거주자의 이용 빈도와 만족도가 높게 나타났습니다.
2026년 하반기 최종 보고서를 발간할 예정입니다.`,
    links: [
      { label: '연구 소개 자료 (Google Drive)', url: 'https://drive.google.com/' },
      { label: '중간 발표 포스터 (PDF)', url: '/files/sample.pdf' },
    ],
  },
  {
    id: 'computational-design',
    title: '데이터 기반 설계 방법론과 설계 교육',
    summary: '환경 데이터와 알고리즘을 활용한 초기 설계 단계의 의사결정 도구를 개발합니다.',
    period: '2023 – 현재',
    status: 'ongoing',
    keywords: ['전산설계', '설계교육', '환경분석'],
    featured: true,
    overview: `일조·바람·조망과 같은 환경 데이터를 초기 설계안 비교에 쉽게 활용할 수 있는 방법을 연구합니다.
설계 스튜디오 수업과 연계하여 학생들의 설계 과정 변화를 함께 관찰합니다.`,
    methods: `1) Grasshopper 기반 환경 분석 워크플로 개발
2) 설계 스튜디오 2개 학기 적용 및 설문
3) 설계안 평가 결과 비교 분석`,
    results: `도구를 사용한 그룹은 초기 대안 수가 평균 1.8배 많았고, 환경 성능에 대한 설명이 구체적이었습니다.`,
    links: [{ label: 'GitHub 저장소 (예시)', url: 'https://github.com/' }],
  },
  {
    id: 'modern-architecture-history',
    title: '한국 근대 건축의 재료와 구법 아카이브',
    summary: '1950–70년대 건축물의 재료와 구법을 기록하고 디지털 아카이브로 정리했습니다.',
    period: '2021 – 2023',
    status: 'completed',
    keywords: ['건축사', '아카이브', '근대건축'],
    featured: true,
    overview: `철거 위기에 놓인 근대 건축물의 재료와 시공 방식을 기록하여 연구 자료로 남기는 프로젝트입니다.`,
    methods: `1) 대상 건축물 30곳 실측 및 사진 기록
2) 당시 시공자·설계자 구술 채록
3) 도면·사진 디지털화 및 메타데이터 구축`,
    results: `30개 건축물의 기록을 정리한 디지털 아카이브를 구축했으며, 연구 결과는 학술지 논문 2편과 전시 1회로 발표했습니다.`,
    links: [{ label: '아카이브 바로가기 (예시)', url: 'https://example.com/' }],
  },
];

/** id 로 연구 프로젝트 하나 찾기 */
export function findResearch(id: string | undefined): Research | undefined {
  return researchList.find((r) => r.id === id);
}
