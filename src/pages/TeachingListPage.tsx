import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { courses } from '../data/courses';
import type { Course } from '../types';

export const levelLabels: Record<Course['level'], string> = {
  undergraduate: '학부',
  graduate: '대학원',
};

type Filter = 'all' | Course['level'];

export default function TeachingListPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = courses.filter((c) => filter === 'all' || c.level === filter);
  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'undergraduate', label: '학부' },
    { value: 'graduate', label: '대학원' },
  ];

  return (
    <>
      <PageHeader title="수업자료" description="담당 과목의 강의 개요와 자료 링크입니다." />
      <div className="container-page py-10">
        <div className="mb-6 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full border px-3 py-1 text-sm ${filter === f.value ? 'border-accent bg-accent text-white' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <Link key={c.id} to={`/teaching/${c.id}`} className="card-link">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="badge bg-neutral-100 text-neutral-600">{levelLabels[c.level]}</span>
                <span>{c.code}</span>
                <span>· {c.semester}</span>
              </div>
              <h3 className="mt-3 font-semibold text-neutral-900">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{c.summary}</p>
              <p className="mt-4 text-xs text-neutral-500">자료 {c.materials.length}개</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
