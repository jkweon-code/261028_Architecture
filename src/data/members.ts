// ─────────────────────────────────────────────────────────────
// 구성원 데이터
//
// [작성법]
// - 사람 한 명이 { ... } 블록 하나입니다. 복사해 붙여 넣고 고치세요.
// - role 은 아래 중 하나이며, 화면에서 이 순서로 묶여 표시됩니다:
//     'professor'(교수) | 'researcher'(연구원) | 'phd'(박사과정) | 'master'(석사과정) | 'alumni'(졸업생)
// - photo: 사진 파일을 public/images/ 폴더에 넣고 '/images/파일이름.jpg' 로 적으세요.
//   비워 두면 이름 첫 글자가 동그라미 안에 표시됩니다.
// - 이메일 등 개인정보 공개 여부는 본인 동의를 받은 뒤 입력하세요.
// ─────────────────────────────────────────────────────────────

import type { Member, MemberRole } from '../types';

export const members: Member[] = [
  {
    id: 'hong',
    name: '홍길동',
    nameEn: 'Gildong Hong',
    role: 'professor',
    title: '교수 · 연구실 책임자',
    email: 'professor@university.ac.kr',
    interests: ['도시 주거', '설계 방법론', '건축 이론'],
    bio: '○○대학교 건축학과를 졸업하고 ○○대학교에서 박사학위를 받았습니다. 국내외 설계사무소 실무를 거쳐 2015년부터 재직 중입니다.',
  },
  {
    id: 'kim',
    name: '김연구',
    role: 'phd',
    title: '박사과정',
    interests: ['공동주거', '도시재생'],
  },
  {
    id: 'lee',
    name: '이설계',
    role: 'phd',
    title: '박사과정',
    interests: ['전산설계', '설계교육'],
  },
  {
    id: 'park',
    name: '박공간',
    role: 'master',
    title: '석사과정',
    interests: ['근대건축', '아카이브'],
  },
  {
    id: 'choi',
    name: '최도시',
    role: 'master',
    title: '석사과정',
    interests: ['도시설계', '공공공간'],
  },
];

/** 구성원 구분별 한글 이름과 표시 순서 */
export const memberRoleLabels: Record<MemberRole, string> = {
  professor: '교수',
  researcher: '연구원',
  phd: '박사과정',
  master: '석사과정',
  alumni: '졸업생',
};
export const memberRoleOrder: MemberRole[] = ['professor', 'researcher', 'phd', 'master', 'alumni'];
