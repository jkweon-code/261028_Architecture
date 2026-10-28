import PageHeader from '../components/PageHeader';
import ArchPattern from '../components/ArchPattern';
import Avatar from '../components/Avatar';
import { memberRoleLabels, memberRoleOrder, members } from '../data/members';
import type { Member } from '../types';

export default function PeoplePage() {
  const professors = members.filter((m) => m.role === 'professor');
  const others = memberRoleOrder.filter((r) => r !== 'professor');

  return (
    <>
      <PageHeader eyebrow="People" title="구성원" description="연구실의 교수와 대학원생을 소개합니다." />
      <div className="container-page py-12">
        {professors.map((m) => (
          <ProfessorCard key={m.id} member={m} />
        ))}

        {others.map((role) => {
          const group = members.filter((m) => m.role === role);
          if (group.length === 0) return null;
          return (
            <section key={role} className="mt-16">
              <h2 className="heading-rule">
                {memberRoleLabels[role]} <span className="text-sm font-normal text-neutral-400">{group.length}</span>
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((m) => (
                  <div key={m.id} className="card flex items-start gap-4">
                    <Avatar name={m.name} photo={m.photo} className="h-14 w-14 text-lg" />
                    <div className="min-w-0">
                      <p className="font-bold text-neutral-900">
                        {m.name}
                        {m.nameEn && <span className="ml-2 text-xs font-normal text-neutral-500">{m.nameEn}</span>}
                      </p>
                      {m.title && <p className="text-sm text-neutral-500">{m.title}</p>}
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="mt-1 block text-sm break-all text-accent hover:underline">
                          {m.email}
                        </a>
                      )}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {m.interests.map((i) => (
                          <span key={i} className="tag">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

/** 교수 소개: 큰 사진(없으면 도면 위에 이니셜) + 소개 */
function ProfessorCard({ member }: { member: Member }) {
  return (
    <section className="grid overflow-hidden rounded-xl border border-neutral-200 md:grid-cols-[280px_1fr]">
      <div className="relative aspect-[4/5] border-b border-neutral-200 md:aspect-auto md:border-r md:border-b-0">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <ArchPattern seed={member.id} variant="elevation" className="absolute inset-0 h-full w-full" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-accent shadow-sm ring-1 ring-neutral-200">
                {member.name.slice(0, 1)}
              </span>
            </span>
          </>
        )}
      </div>
      <div className="p-6 sm:p-10">
        <p className="eyebrow">{memberRoleLabels[member.role]}</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">
          {member.name}
          {member.nameEn && <span className="ml-3 text-base font-normal text-neutral-400">{member.nameEn}</span>}
        </h2>
        {member.title && <p className="mt-1 text-neutral-600">{member.title}</p>}
        {member.bio && <p className="mt-6 max-w-2xl text-[15px] leading-8 text-neutral-700">{member.bio}</p>}
        <dl className="mt-8 grid gap-6 border-t border-neutral-200 pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="eyebrow">Research Interests</dt>
            <dd className="mt-3 flex flex-wrap gap-1.5">
              {member.interests.map((i) => (
                <span key={i} className="tag">
                  {i}
                </span>
              ))}
            </dd>
          </div>
          {member.email && (
            <div>
              <dt className="eyebrow">Contact</dt>
              <dd className="mt-3">
                <a href={`mailto:${member.email}`} className="text-accent hover:underline">
                  {member.email}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
