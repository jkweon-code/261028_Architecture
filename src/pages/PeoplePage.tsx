import PageHeader from '../components/PageHeader';
import { memberRoleLabels, memberRoleOrder, members } from '../data/members';
import type { Member } from '../types';

export default function PeoplePage() {
  return (
    <>
      <PageHeader title="구성원" description="연구실의 교수와 대학원생을 소개합니다." />
      <div className="container-page space-y-12 py-10">
        {memberRoleOrder.map((role) => {
          const group = members.filter((m) => m.role === role);
          if (group.length === 0) return null;
          return (
            <section key={role}>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">{memberRoleLabels[role]}</h2>
              <div className={`grid gap-4 ${role === 'professor' ? '' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                {group.map((m) => (
                  <MemberCard key={m.id} member={m} large={role === 'professor'} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function MemberCard({ member, large }: { member: Member; large: boolean }) {
  const size = large ? 'h-24 w-24 text-3xl' : 'h-14 w-14 text-xl';
  return (
    <div className={`card flex gap-5 ${large ? 'flex-col sm:flex-row' : 'items-start'}`}>
      {member.photo ? (
        <img src={member.photo} alt={member.name} className={`${size} shrink-0 rounded-full object-cover`} />
      ) : (
        <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent`}>
          {member.name.slice(0, 1)}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-neutral-900">
          {member.name}
          {member.nameEn && <span className="ml-2 text-sm font-normal text-neutral-500">{member.nameEn}</span>}
        </p>
        {member.title && <p className="text-sm text-neutral-600">{member.title}</p>}
        {member.email && (
          <a href={`mailto:${member.email}`} className="text-sm break-all text-accent hover:underline">
            {member.email}
          </a>
        )}
        {member.bio && <p className="mt-3 text-sm leading-relaxed text-neutral-600">{member.bio}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.interests.map((i) => (
            <span key={i} className="badge bg-neutral-100 text-neutral-600">
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
