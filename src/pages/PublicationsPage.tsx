import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import ResourceLink from '../components/ResourceLink';
import { publications, publicationTypeLabels } from '../data/publications';
import type { PublicationType } from '../types';

type Filter = 'all' | PublicationType;

export default function PublicationsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const shown = publications
    .filter((p) => filter === 'all' || p.type === filter)
    .sort((a, b) => b.year - a.year);
  // 연도별로 묶기 (최신 연도부터)
  const years = [...new Set(shown.map((p) => p.year))];

  const types = Object.keys(publicationTypeLabels) as PublicationType[];
  const count = (t: Filter) => (t === 'all' ? publications.length : publications.filter((p) => p.type === t).length);

  return (
    <>
      <PageHeader title="성과" description="논문, 학회 발표, 저서, 보고서, 전시 목록입니다." />
      <div className="container-page py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {(['all', ...types] as Filter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`rounded-full border px-3 py-1 text-sm ${filter === t ? 'border-accent bg-accent text-white' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}
            >
              {t === 'all' ? '전체' : publicationTypeLabels[t]} <span className="opacity-70">{count(t)}</span>
            </button>
          ))}
        </div>

        {years.length === 0 && <p className="text-sm text-neutral-500">해당 유형의 항목이 없습니다.</p>}

        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <h2 className="mb-3 text-lg font-bold text-neutral-900">{year}</h2>
              <ul className="space-y-4 border-l border-neutral-200 pl-5">
                {shown
                  .filter((p) => p.year === year)
                  .map((p) => (
                    <li key={p.id} className="text-sm">
                      <span className="badge mb-1 bg-accent/10 text-accent">{publicationTypeLabels[p.type]}</span>
                      <p className="font-medium text-neutral-900">
                        {p.url ? <ResourceLink href={p.url} className="hover:text-accent hover:underline">{p.title}</ResourceLink> : p.title}
                      </p>
                      <p className="mt-0.5 text-neutral-600">{p.authors}</p>
                      <p className="text-neutral-500 italic">{p.venue}</p>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
