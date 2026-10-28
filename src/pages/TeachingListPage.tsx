import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { courses } from '../data/courses';
import type { Course } from '../types';
import { FilterTabs } from './ResearchListPage';

export const levelLabels: Record<Course['level'], string> = {
  undergraduate: '학부',
  graduate: '대학원',
};

type Filter = 'all' | Course['level'];

export default function TeachingListPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = courses.filter((c) => filter === 'all' || c.level === filter);
  const filters: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: '전체', count: courses.length },
    { value: 'undergraduate', label: '학부', count: courses.filter((c) => c.level === 'undergraduate').length },
    { value: 'graduate', label: '대학원', count: courses.filter((c) => c.level === 'graduate').length },
  ];

  return (
    <>
      <PageHeader eyebrow="Teaching" title="수업자료" description="담당 과목의 강의 개요와 자료 링크입니다." />
      <div className="container-page py-12">
        <FilterTabs options={filters} value={filter} onChange={setFilter} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <Link key={c.id} to={`/teaching/${c.id}`} className="card-link group flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-sm font-semibold tracking-wider text-accent">{c.code}</span>
                <span className="badge bg-neutral-100 text-neutral-600">{levelLabels[c.level]}</span>
              </div>
              <h2 className="mt-8 text-lg leading-snug font-bold text-neutral-900 group-hover:text-accent">{c.title}</h2>
              <p className="mt-2 mb-6 text-sm leading-relaxed text-neutral-600">{c.summary}</p>
              <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500">
                <span>{c.semester}</span>
                <span>자료 {c.materials.length}개 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
