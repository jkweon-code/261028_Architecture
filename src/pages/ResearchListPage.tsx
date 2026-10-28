import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ResearchCover from '../components/ResearchCover';
import { researchList } from '../data/research';

type Filter = 'all' | 'ongoing' | 'completed';

export default function ResearchListPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = researchList.filter((r) => filter === 'all' || r.status === filter);
  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'ongoing', label: '진행 중' },
    { value: 'completed', label: '완료' },
  ];

  return (
    <>
      <PageHeader eyebrow="Research" title="연구" description="연구실에서 수행 중이거나 완료한 연구 프로젝트입니다." />
      <div className="container-page py-12">
        <FilterTabs options={filters} value={filter} onChange={setFilter} />
        <div className="mt-10 space-y-6">
          {shown.map((r, i) => (
            <Link
              key={r.id}
              to={`/research/${r.id}`}
              className="group grid overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] md:grid-cols-[320px_1fr]"
            >
              <div className="overflow-hidden border-b border-neutral-200 md:border-r md:border-b-0">
                <ResearchCover research={r} className="aspect-[16/10] h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <StatusBadge status={r.status} />
                  <span>{r.period}</span>
                </div>
                <h2 className="mt-3 text-xl leading-snug font-bold text-neutral-900 group-hover:text-accent">{r.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{r.summary}</p>
                <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {r.keywords.map((k) => (
                      <span key={k} className="tag">
                        {k}
                      </span>
                    ))}
                  </div>
                  <span className="shrink-0 text-sm text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-accent">
                    자세히 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export function StatusBadge({ status }: { status: 'ongoing' | 'completed' }) {
  return status === 'ongoing' ? (
    <span className="badge gap-1.5 bg-accent/10 text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      진행 중
    </span>
  ) : (
    <span className="badge bg-neutral-100 text-neutral-600">완료</span>
  );
}

/** 알약 모양 필터 버튼 묶음 (여러 페이지에서 사용) */
export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            value === o.value
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
          }`}
        >
          {o.label}
          {o.count !== undefined && <span className="ml-1.5 opacity-60 tabular-nums">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}
