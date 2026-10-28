import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-5xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-xl font-semibold text-neutral-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-neutral-600">주소가 바뀌었거나 삭제된 페이지일 수 있습니다.</p>
      <Link to="/" className="btn-primary mt-8">
        홈으로
      </Link>
    </div>
  );
}
