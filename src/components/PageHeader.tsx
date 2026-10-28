import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string; // 영문 작은 제목 (예: 'Research')
  title: string;
  description?: string;
  children?: ReactNode; // 제목 오른쪽 버튼 등
}

/** 각 페이지 상단 제목 영역 */
export default function PageHeader({ eyebrow, title, description, children }: Props) {
  return (
    <div className="bg-grid relative border-b border-neutral-200">
      <div className="container-page relative flex flex-col gap-6 pt-14 pb-10 sm:flex-row sm:items-end sm:justify-between sm:pt-20">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-[40px]">{title}</h1>
          {description && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-600">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
