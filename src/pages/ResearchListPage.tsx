import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { researchList } from '../data/research';
import type { Research } from '../types';

export default function ResearchListPage() {
  const ongoing = researchList.filter((r) => r.status === 'ongoing');
  const completed = researchList.filter((r) => r.status === 'completed');

  return (
    <>
      <PageHeader title="연구" description="연구실에서 수행 중이거나 완료한 연구 프로젝트입니다." />
      <div className="container-page space-y-12 py-10">
        <ResearchGroup title="진행 중인 연구" items={ongoing} />
        <ResearchGroup title="완료된 연구" items={completed} />
      </div>
    </>
  );
}

function ResearchGroup({ title, items }: { title: string; items: Research[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((r) => (
          <Link key={r.id} to={`/research/${r.id}`} className="card-link">
            <p className="text-xs text-neutral-500">{r.period}</p>
            <h3 className="mt-2 font-semibold text-neutral-900">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{r.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {r.keywords.map((k) => (
                <span key={k} className="badge bg-neutral-100 text-neutral-600">
                  {k}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
