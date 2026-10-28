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

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = findCourse(id);
  if (!course) return <NotFoundPage />;

  return (
    <article className="container-page max-w-3xl py-10">
      <Link to="/teaching" className="text-sm text-neutral-500 hover:text-accent">
        ← 수업자료 목록
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        <span className="badge bg-neutral-100 text-neutral-600">{levelLabels[course.level]}</span>
        <span>{course.code}</span>
        <span>· {course.semester}</span>
      </div>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">{course.title}</h1>

      <section className="mt-10">
        <h2 className="mb-3 border-l-4 border-accent pl-3 text-lg font-semibold text-neutral-900">강의 개요</h2>
        <p className="text-sm leading-7 whitespace-pre-line text-neutral-700">{course.overview}</p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 border-l-4 border-accent pl-3 text-lg font-semibold text-neutral-900">자료</h2>
        {course.materials.length === 0 ? (
          <p className="text-sm text-neutral-500">등록된 자료가 없습니다.</p>
        ) : (
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
            {course.materials.map((m) => (
              <li key={m.url + m.title} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm">
                {m.week && <span className="w-14 shrink-0 text-xs text-neutral-500">{m.week}</span>}
                <span className="badge shrink-0 bg-neutral-100 text-neutral-600">{materialTypeLabels[m.type]}</span>
                <ResourceLink href={m.url} className="flex-1 text-neutral-800 hover:text-accent hover:underline">
                  {m.title} ↗
                </ResourceLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
