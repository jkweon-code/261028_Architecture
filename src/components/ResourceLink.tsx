import type { ReactNode } from 'react';

/** 외부 링크나 public/files/ 파일 링크를 새 탭으로 엽니다. */
export default function ResourceLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className ?? 'text-accent hover:underline'}>
      {children}
    </a>
  );
}
