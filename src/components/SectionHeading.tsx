import { Link } from 'react-router-dom';

interface Props {
  index?: string; // 예: '01'
  eyebrow: string; // 영문 작은 제목
  title: string;
  to?: string; // "전체 보기" 링크
}

/** 홈 화면 등의 구역 제목: 01 — RESEARCH / 주요 연구 분야 */
export default function SectionHeading({ index, eyebrow, title, to }: Props) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-neutral-900 pb-4">
      <div>
        <p className="eyebrow">
          {index && <span className="mr-2 text-accent">{index}</span>}
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[28px]">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="group shrink-0 text-sm text-neutral-500 hover:text-neutral-900">
          전체 보기 <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}
