import { Link, useParams } from 'react-router-dom';
import ResourceLink from '../components/ResourceLink';
import { findCourse } from '../data/courses';
import type { CourseMaterial } from '../types';
import { levelLabels } from './TeachingListPage';
import NotFoundPage from './NotFoundPage';

const materialTypeLabels: Record<CourseMaterial['type'], string> = {
  slide: '강의자료',
  reading: '읽기자료',
  assignment: '과제',
  video: '영상',
  etc: '기타',
};

// 자료 유형별 작은 아이콘 (선 그림)
const materialIcons: Record<CourseMaterial['type'], string> = {
  slide: 'M4 5h16v11H4zM12 16v4M8 20h8',
  reading: 'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v14',
  assignment: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  video: 'M4 6h12v12H4zM16 10l4-2v8l-4-2',
  etc: 'M5 12h.01M12 12h.01M19 12h.01',
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = findCourse(id);
  if (!course) return <NotFoundPage />;

  return (
    <article>
      <header className="bg-grid border-b border-neutral-200">
        <div className="container-page pt-10 pb-12">
          <Link to="/teaching" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← 수업자료 목록
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <span className="font-mono font-semibold tracking-wider text-accent">{course.code}</span>
            <span className="badge bg-white text-neutral-600 ring-1 ring-neutral-200">{levelLabels[course.level]}</span>
            <span>{course.semester}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-600">{course.summary}</p>
        </div>
      </header>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1.4fr]">
        <section>
          <h2 className="heading-rule">강의 개요</h2>
          <p className="mt-5 text-[15px] leading-8 whitespace-pre-line text-neutral-700">{course.overview}</p>
        </section>

        <section>
          <h2 className="heading-rule">
            자료 <span className="text-sm font-normal text-neutral-400">{course.materials.length}</span>
          </h2>
          {course.materials.length === 0 ? (
            <p className="mt-5 text-sm text-neutral-500">등록된 자료가 없습니다.</p>
          ) : (
            <ul className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
              {course.materials.map((m) => (
                <li key={m.url + m.title}>
                  <ResourceLink href={m.url} className="group flex items-center gap-4 py-4 text-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-accent group-hover:text-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                        <path d={materialIcons[m.type]} />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-neutral-900 group-hover:text-accent">{m.title}</span>
                      <span className="mt-0.5 block text-xs text-neutral-500">
                        {m.week && `${m.week} · `}
                        {materialTypeLabels[m.type]}
                      </span>
                    </span>
                    <span className="text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">↗</span>
                  </ResourceLink>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
}
