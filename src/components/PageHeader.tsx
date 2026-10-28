import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children?: ReactNode; // 제목 오른쪽 버튼 등
}

/** 각 페이지 상단 제목 영역 */
export default function PageHeader({ title, description, children }: Props) {
  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="container-page flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 text-sm text-neutral-600">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
