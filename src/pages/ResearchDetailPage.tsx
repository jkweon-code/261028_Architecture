import { Link, useParams } from 'react-router-dom';
import ResourceLink from '../components/ResourceLink';
import { findResearch } from '../data/research';
import { useAuth } from '../context/AuthContext';
import NotFoundPage from './NotFoundPage';

export default function ResearchDetailPage() {
  const { id } = useParams();
  const research = findResearch(id);
  const { canUseDiscussion } = useAuth();

  if (!research) return <NotFoundPage />;

  const sections = [
    { title: '개요', body: research.overview },
    { title: '연구 방법', body: research.methods },
    { title: '결과 요약', body: research.results },
  ];

  return (
    <article className="container-page max-w-3xl py-10">
      <Link to="/research" className="text-sm text-neutral-500 hover:text-accent">
        ← 연구 목록
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        <span className={`badge ${research.status === 'ongoing' ? 'bg-accent/10 text-accent' : 'bg-neutral-100 text-neutral-600'}`}>
          {research.status === 'ongoing' ? '진행 중' : '완료'}
        </span>
        <span className="text-neutral-500">{research.period}</span>
      </div>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">{research.title}</h1>
      <p className="mt-3 text-neutral-600">{research.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {research.keywords.map((k) => (
          <span key={k} className="badge bg-neutral-100 text-neutral-600">
            {k}
          </span>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-3 border-l-4 border-accent pl-3 text-lg font-semibold text-neutral-900">{s.title}</h2>
            <p className="text-sm leading-7 whitespace-pre-line text-neutral-700">{s.body}</p>
          </section>
        ))}

        {research.links.length > 0 && (
          <section>
            <h2 className="mb-3 border-l-4 border-accent pl-3 text-lg font-semibold text-neutral-900">관련 링크</h2>
            <ul className="space-y-2 text-sm">
              {research.links.map((l) => (
                <li key={l.url + l.label}>
                  <ResourceLink href={l.url}>{l.label} ↗</ResourceLink>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {canUseDiscussion && (
        <div className="mt-12 rounded-lg bg-neutral-50 p-5 text-sm">
          이 연구에 대해 의견을 나누고 싶다면{' '}
          <Link to={`/discussion/new?research=${research.id}`} className="font-medium text-accent hover:underline">
            토론 글쓰기 →
          </Link>
        </div>
      )}
    </article>
  );
}
