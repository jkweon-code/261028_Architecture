import { Link, useParams } from 'react-router-dom';
import ResourceLink from '../components/ResourceLink';
import ResearchCover from '../components/ResearchCover';
import { findResearch } from '../data/research';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from './ResearchListPage';
import NotFoundPage from './NotFoundPage';

export default function ResearchDetailPage() {
  const { id } = useParams();
  const research = findResearch(id);
  const { canUseDiscussion } = useAuth();

  if (!research) return <NotFoundPage />;

  const sections = [
    { title: '개요', en: 'Overview', body: research.overview },
    { title: '연구 방법', en: 'Methods', body: research.methods },
    { title: '결과 요약', en: 'Findings', body: research.results },
  ];

  return (
    <article>
      {/* 상단 */}
      <header className="bg-grid border-b border-neutral-200">
        <div className="container-page pt-10 pb-12">
          <Link to="/research" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← 연구 목록
          </Link>
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <StatusBadge status={research.status} />
                <span>{research.period}</span>
              </div>
              <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-neutral-900 sm:text-4xl">{research.title}</h1>
              <p className="mt-4 text-lg leading-relaxed text-neutral-600">{research.summary}</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              <ResearchCover research={research} className="aspect-[16/10] w-full" />
            </div>
          </div>
        </div>
      </header>

      {/* 본문 + 옆 정보 */}
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_260px]">
        <div className="space-y-14">
          {sections.map((s, i) => (
            <section key={s.title} className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <div>
                <p className="text-xs font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</p>
                <p className="eyebrow mt-1">{s.en}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{s.title}</h2>
                <p className="mt-4 text-[15px] leading-8 whitespace-pre-line text-neutral-700">{s.body}</p>
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div>
            <p className="eyebrow">Keywords</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {research.keywords.map((k) => (
                <span key={k} className="tag">
                  {k}
                </span>
              ))}
            </div>
          </div>
          {research.links.length > 0 && (
            <div>
              <p className="eyebrow">Links</p>
              <ul className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200 text-sm">
                {research.links.map((l) => (
                  <li key={l.url + l.label}>
                    <ResourceLink href={l.url} className="group flex items-center justify-between gap-3 py-3 text-neutral-800 hover:text-accent">
                      <span>{l.label}</span>
                      <span className="text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">
                        ↗
                      </span>
                    </ResourceLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {canUseDiscussion && (
            <div className="rounded-xl bg-neutral-900 p-5 text-sm text-neutral-300">
              <p>이 연구에 대해 의견을 나누어 보세요.</p>
              <Link
                to={`/discussion/new?research=${research.id}`}
                className="mt-4 inline-flex items-center gap-1 font-semibold text-white hover:underline"
              >
                토론 글쓰기 →
              </Link>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
