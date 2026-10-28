// ─────────────────────────────────────────────────────────────
// 수업(과목) 데이터
//
// [작성법]
// - 과목 하나가 { ... } 블록 하나입니다. 복사해 붙여 넣고 고치세요.
// - id 는 주소에 쓰입니다 (영문 소문자, 숫자, 하이픈). 예) 'design-studio-3'
// - level 은 'undergraduate'(학부) 또는 'graduate'(대학원)입니다.
// - materials(자료 목록)의 type 은 아래 중 하나입니다:
//     'slide'(강의자료) | 'reading'(읽기자료) | 'assignment'(과제) | 'video'(영상) | 'etc'(기타)
// - url 에는 Google Drive 공유 링크 같은 외부 주소를 넣거나,
//   public/files/ 폴더에 파일을 넣고 '/files/파일이름.pdf' 처럼 적으세요.
//   ⚠️ public/files/ 의 파일은 누구나 내려받을 수 있습니다. 미공개 자료는 넣지 마세요.
// ─────────────────────────────────────────────────────────────

import type { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'design-studio-3',
    code: 'ARCH301',
    title: '건축설계 스튜디오 3',
    semester: '2026-2학기',
    level: 'undergraduate',
    summary: '도시 맥락 속 중규모 복합 건축물의 설계를 다룹니다.',
    overview: `대지 분석에서 출발하여 프로그램 구성, 공간 구조, 재료와 디테일까지 하나의 설계안을 완성합니다.
매주 크리틱과 중간·최종 리뷰로 진행됩니다.`,
    materials: [
      { week: '1주차', title: '강의계획서 및 스튜디오 안내', url: '/files/sample.pdf', type: 'slide' },
      { week: '2주차', title: '대지 분석 방법', url: 'https://drive.google.com/', type: 'slide' },
      { week: '3주차', title: '참고 문헌: 도시와 건축', url: 'https://drive.google.com/', type: 'reading' },
      { week: '5주차', title: '과제 1: 대지 분석 보고서', url: 'https://drive.google.com/', type: 'assignment' },
    ],
  },
  {
    id: 'architectural-theory',
    code: 'ARCH620',
    title: '현대 건축 이론 세미나',
    semester: '2026-2학기',
    level: 'graduate',
    summary: '20세기 후반 이후 건축 담론의 주요 텍스트를 함께 읽고 토론합니다.',
    overview: `매주 지정 텍스트를 읽고 발제와 토론으로 진행합니다. 학기말에는 개인 연구 주제와 연결한 소논문을 제출합니다.`,
    materials: [
      { week: '1주차', title: '세미나 안내 및 읽기 목록', url: 'https://drive.google.com/', type: 'reading' },
      { week: '2주차', title: '발제 자료 양식', url: 'https://drive.google.com/', type: 'etc' },
      { title: '특강 녹화 영상', url: 'https://www.youtube.com/', type: 'video' },
    ],
  },
  {
    id: 'digital-design-method',
    code: 'ARCH415',
    title: '디지털 설계 방법론',
    semester: '2026-1학기',
    level: 'undergraduate',
    summary: '파라메트릭 도구와 환경 분석을 활용한 설계 방법을 실습합니다.',
    overview: `Rhino와 Grasshopper를 활용하여 형태 생성과 환경 분석을 실습하고, 이를 설계 의사결정에 연결하는 방법을 익힙니다.`,
    materials: [
      { week: '1주차', title: '소프트웨어 설치 안내', url: 'https://drive.google.com/', type: 'etc' },
      { week: '2주차', title: 'Grasshopper 기초', url: 'https://drive.google.com/', type: 'slide' },
    ],
  },
];

/** id 로 과목 하나 찾기 */
export function findCourse(id: string | undefined): Course | undefined {
  return courses.find((c) => c.id === id);
}
