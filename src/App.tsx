import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireRole from './components/RequireRole';
import HomePage from './pages/HomePage';
import ResearchListPage from './pages/ResearchListPage';
import ResearchDetailPage from './pages/ResearchDetailPage';
import TeachingListPage from './pages/TeachingListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import PublicationsPage from './pages/PublicationsPage';
import DiscussionListPage from './pages/DiscussionListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditorPage from './pages/PostEditorPage';
import PeoplePage from './pages/PeoplePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="research" element={<ResearchListPage />} />
        <Route path="research/:id" element={<ResearchDetailPage />} />
        <Route path="teaching" element={<TeachingListPage />} />
        <Route path="teaching/:id" element={<CourseDetailPage />} />
        <Route path="publications" element={<PublicationsPage />} />
        {/* 토론: 승인된 구성원(admin, member)만 */}
        <Route path="discussion" element={<RequireRole />}>
          <Route index element={<DiscussionListPage />} />
          <Route path="new" element={<PostEditorPage />} />
          <Route path=":id" element={<PostDetailPage />} />
          <Route path=":id/edit" element={<PostEditorPage />} />
        </Route>
        <Route path="people" element={<PeoplePage />} />
        {/* TODO(Phase2): /admin 사용자 승인 페이지 추가 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
