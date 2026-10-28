import { Link } from 'react-router-dom';
import ArchPattern from '../components/ArchPattern';

export default function NotFoundPage() {
  return (
    <div className="container-page grid items-center gap-12 py-20 md:grid-cols-2">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-4 text-neutral-600">주소가 바뀌었거나 삭제된 페이지일 수 있습니다.</p>
        <Link to="/" className="btn-primary mt-10">
          ← 홈으로
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <ArchPattern seed="not-found" variant="plan" className="aspect-[16/10] w-full" />
      </div>
    </div>
  );
}
