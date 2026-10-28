import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { researchList } from '../data/research';
import { publications, publicationTypeLabels } from '../data/publications';
import { members } from '../data/members';
import { courses } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import { discussionService } from '../services/discussionService';
import { formatDate } from '../lib/format';
import ArchPattern from '../components/ArchPattern';
import ResearchCover from '../components/ResearchCover';
import SectionHeading from '../components/SectionHeading';
import LockIcon from '../components/LockIcon';
import type { Post } from '../types';

export default function HomePage() {
  const featured = researchList.filter((r) => r.featured);
  const recentPubs = [...publications].sort((a, b) => b.year - a.year).slice(0, 4);

  // 숫자로 보는 연구실 (데이터 파일에서 자동 계산)
  const stats = [
    { label: '진행 중인 연구', value: researchList.filter((r) => r.status === 'ongoing').length },
    { label: '논문 · 발표', value: publications.length },
    { label: '개설 과목', value: courses.length },
    { label: '구성원', value: members.filter((m) => m.role !== 'alumni').length },
  ];

  return (
    <>
      {/* 연구실 소개 */}
      <section className="bg-grid relative overflow-hidden border-b border-neutral-200">
        <div className="container-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="eyebrow">
              <span className="text-accent">●</span> {siteConfig.affiliation}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.15] font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-[56px]">
              {siteConfig.name}
            </h1>
            <p className="mt-2 text-sm font-medium tracking-[0.14em] text-neutral-400 uppercase">{siteConfig.nameEn}</p>
            <p className="mt-8 text-xl leading-snug font-medium text-neutral-800 sm:text-2xl">{siteConfig.tagline}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-600">{siteConfig.intro}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/research" className="btn-primary">
                연구 둘러보기 →
              </Link>
              <Link to="/people" className="btn-secondary">
                구성원 소개
              </Link>
            </div>
          </div>

          {/* 도면 판넬 */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-3">
              <figure className="col-span-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <ArchPattern seed="hero-plan" variant="plan" className="aspect-[16/9] w-full" />
                <figcaption className="flex justify-between border-t border-neutral-200 px-4 py-2 text-[11px] tracking-wider text-neutral-500 uppercase">
                  <span>Plan</span>
                  <span>1 : 100</span>
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <ArchPattern seed="hero-section" variant="section" className="aspect-[4/3] w-full" />
                <figcaption className="border-t border-neutral-200 px-4 py-2 text-[11px] tracking-wider text-neutral-500 uppercase">Section</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <ArchPattern seed="hero-elev" variant="elevation" className="aspect-[4/3] w-full" />
                <figcaption className="border-t border-neutral-200 px-4 py-2 text-[11px] tracking-wider text-neutral-500 uppercase">Elevation</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 숫자로 보는 연구실 */}
      <section className="border-b border-neutral-200">
        <div className="container-page">
          <dl className="grid grid-cols-2 gap-px bg-neutral-200 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-2 py-8 sm:px-6">
                <dd className="text-4xl font-bold tracking-tight text-neutral-900 tabular-nums">{s.value}</dd>
                <dt className="mt-1 text-sm text-neutral-500">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 주요 연구 분야 */}
      <section className="container-page pt-20">
        <SectionHeading index="01" eyebrow="Research" title="주요 연구 분야" to="/research" />
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((r, i) => (
            <Link key={r.id} to={`/research/${r.id}`} className="group block">
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <ResearchCover research={r} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="mt-5 flex items-center gap-3 text-xs text-neutral-500">
                <span className="font-semibold text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="h-px w-6 bg-neutral-300" />
                <span>{r.period}</span>
              </div>
              <h3 className="mt-2 text-lg leading-snug font-bold text-neutral-900 group-hover:text-accent">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{r.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.keywords.map((k) => (
                  <span key={k} className="tag">
                    {k}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 최근 토론 + 최근 성과 */}
      <section className="container-page grid gap-16 pt-24 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
        <div>
          <SectionHeading index="02" eyebrow="Discussion" title="최근 토론" to="/discussion" />
          <RecentPosts />
        </div>
        <div>
          <SectionHeading index="03" eyebrow="Publications" title="최근 성과" to="/publications" />
          <ul className="space-y-6">
            {recentPubs.map((p) => (
              <li key={p.id} className="grid grid-cols-[52px_1fr] gap-3">
                <span className="text-sm font-semibold text-neutral-400 tabular-nums">{p.year}</span>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-accent uppercase">{publicationTypeLabels[p.type]}</p>
                  <p className="mt-1 text-sm leading-snug font-medium text-neutral-900">{p.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">{p.venue}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

/** 최근 토론글 3개 (구성원에게만 표시) */
function RecentPosts() {
  const { canUseDiscussion } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    if (!canUseDiscussion) return;
    let alive = true;
    discussionService.listPosts(3).then((page) => alive && setPosts(page.posts));
    return () => {
      alive = false;
    };
  }, [canUseDiscussion]);

  if (!canUseDiscussion) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-500">
        <LockIcon />
        토론 글은 로그인한 연구실 구성원에게만 보입니다.
      </div>
    );
  }
  if (posts === null) return <p className="text-sm text-neutral-500">불러오는 중…</p>;
  if (posts.length === 0) return <p className="text-sm text-neutral-500">아직 글이 없습니다.</p>;

  return (
    <ul className="divide-y divide-neutral-200">
      {posts.map((p) => (
        <li key={p.id}>
          <Link to={`/discussion/${p.id}`} className="group flex items-start gap-4 py-5 first:pt-0">
            <span className="badge mt-0.5 shrink-0 bg-accent/10 text-accent">{p.category}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-neutral-900 group-hover:text-accent">{p.title}</span>
              <span className="mt-1 block text-xs text-neutral-500">
                {p.authorName} · {formatDate(p.createdAt)}
              </span>
            </span>
            <span className="text-neutral-300 transition-transform group-hover:translate-x-1 group-hover:text-accent">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
