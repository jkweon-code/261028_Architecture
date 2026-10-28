import { researchList } from '../data/research';
import type { Research } from '../types';
import ArchPattern from './ArchPattern';

const variants = ['section', 'plan', 'elevation'] as const;

/** 연구 대표 이미지. 사진이 없으면 도면풍 그림 (목록 순서대로 단면·평면·입면을 번갈아 사용) */
export default function ResearchCover({ research, className = '' }: { research: Research; className?: string }) {
  if (research.image) {
    return <img src={research.image} alt="" className={`object-cover ${className}`} />;
  }
  const index = Math.max(0, researchList.findIndex((r) => r.id === research.id));
  return <ArchPattern seed={research.id} variant={variants[index % variants.length]} className={className} />;
}
