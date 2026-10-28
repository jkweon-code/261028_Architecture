import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import ResourceLink from '../components/ResourceLink';
import { publications, publicationTypeLabels } from '../data/publications';
import type { PublicationType } from '../types';
import { FilterTabs } from './ResearchListPage';

type Filter = 'all' | PublicationType;

export default function PublicationsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const shown = publications
    .filter((p) => filter === 'all' || p.type === filter)
    .sort((a, b) => b.year - a.year);
  // 연도별로 묶기 (최신 연도부터)
  const years = [...new Set(shown.map((p) => p.year))];

  const types = Object.keys(publicationTypeLabels) as PublicationType[];
  const options = [
    { value: 'all' as Filter, label: '전체', count: publications.length },
    ...types.map((t) => ({ value: t as Filter, label: publicationTypeLabels[t], count: publications.filter((p) => p.type === t).length })),
  ];

  return (
    <>
      <PageHeader eyebrow="Publications" title="성과" description="논문, 학회 발표, 저서, 보고서, 전시 목록입니다." />
      <div className="container-page py-12">
        <FilterTabs options={options} value={filter} onChange={setFilter} />

        {years.length === 0 && <p className="mt-10 text-sm text-neutral-500">해당 유형의 항목이 없습니다.</p>}

        <div className="mt-12">
          {years.map((year) => (
            <section key={year} className="grid gap-4 border-t border-neutral-900 py-8 md:grid-cols-[160px_1fr]">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums md:sticky md:top-28 md:self-start">{year}</h2>
              <ul className="divide-y divide-neutral-200">
                {shown
                  .filter((p) => p.year === year)
                  .map((p) => (
                    <li key={p.id} className="group grid gap-x-6 gap-y-2 py-5 first:pt-0 sm:grid-cols-[96px_1fr]">
                      <span className="pt-0.5 text-[11px] font-semibold tracking-wider text-accent uppercase">{publicationTypeLabels[p.type]}</span>
                      <div>
                        <p className="leading-snug font-semibold text-neutral-900">
                          {p.url ? (
                            <ResourceLink href={p.url} className="hover:text-accent">
                              {p.title} <span className="text-neutral-300 group-hover:text-accent">↗</span>
                            </ResourceLink>
                          ) : (
                            p.title
                          )}
                        </p>
                        <p className="mt-1.5 text-sm text-neutral-600">{p.authors}</p>
                        <p className="mt-0.5 text-sm text-neutral-500 italic">{p.venue}</p>
                      </div>
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
