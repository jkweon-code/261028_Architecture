// ─────────────────────────────────────────────────────────────
// 1단계용 토론 서비스: 브라우저 localStorage 에 저장합니다.
// - 이 브라우저에서만 보이는 데이터입니다 (다른 사람과 공유되지 않음).
// - Firestore 와 같은 사용감을 위해 모든 메서드가 Promise 를 반환합니다.
// TODO(Phase2): firestoreDiscussionService 로 교체되면 이 파일은 사용하지 않습니다.
// ─────────────────────────────────────────────────────────────

import type { Comment, Post } from '../types';
import type { DiscussionService } from './discussionService';

const POSTS_KEY = 'archlab.posts';
const COMMENTS_KEY = 'archlab.comments';

// 처음 실행할 때 넣어 두는 예시 글 (개발용 가짜 사용자가 쓴 것으로 표시)
const seedPosts: Post[] = [
  {
    id: 'seed-1',
    title: '공동주거 사례 조사 중간 정리 공유합니다',
    body: '지난 2주간 조사한 사례 24건을 6개 유형으로 묶어 보았습니다.\n공용공간이 가로에 면한 경우와 중정형인 경우의 이용 빈도 차이가 꽤 큽니다.\n다음 회의 전에 분류 기준에 대한 의견 부탁드립니다.',
    category: '연구토론',
    relatedResearchId: 'urban-housing',
    authorUid: 'dev-member',
    authorName: '김연구',
    createdAt: '2026-10-20T09:30:00.000Z',
    updatedAt: '2026-10-20T09:30:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Grasshopper 일조 분석 스크립트 오류 질문',
    body: 'Ladybug 컴포넌트 버전을 올린 뒤 일조 시간 결과가 0으로 나옵니다. 같은 문제를 겪으신 분 있을까요?',
    category: '질문',
    relatedResearchId: 'computational-design',
    authorUid: 'dev-member-2',
    authorName: '이설계',
    createdAt: '2026-10-24T05:10:00.000Z',
    updatedAt: '2026-10-24T05:10:00.000Z',
  },
  {
    id: 'seed-3',
    title: '11월 연구실 세미나 일정 안내',
    body: '11월 세미나는 매주 수요일 오후 4시에 진행합니다.\n발표 순서는 공유 드라이브의 일정표를 확인해 주세요.',
    category: '공지',
    authorUid: 'dev-admin',
    authorName: '홍길동',
    createdAt: '2026-10-27T01:00:00.000Z',
    updatedAt: '2026-10-27T01:00:00.000Z',
  },
];

const seedComments: Comment[] = [
  {
    id: 'seed-c1',
    postId: 'seed-1',
    body: '분류 기준에 "주동 배치"도 추가해 보면 좋겠습니다. 회의 때 같이 보죠.',
    authorUid: 'dev-admin',
    authorName: '홍길동',
    createdAt: '2026-10-20T12:00:00.000Z',
  },
];

// ── localStorage 읽기/쓰기 ──────────────────────────────────

function read<T>(key: string, fallback: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    // 처음 실행이면 예시 데이터를 저장해 둔다
    localStorage.setItem(key, JSON.stringify(fallback));
    return [...fallback];
  }
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

const readPosts = () => read<Post>(POSTS_KEY, seedPosts);
const readComments = () => read<Comment>(COMMENTS_KEY, seedComments);

// 네트워크가 있는 것처럼 약간 기다린 뒤 결과를 돌려준다 (로딩 화면 확인용)
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function newId() {
  return crypto.randomUUID();
}

// ── 댓글 실시간 구독 흉내 ───────────────────────────────────

type Listener = (comments: Comment[]) => void;
const listeners = new Map<string, Set<Listener>>();

function commentsOf(postId: string) {
  return readComments()
    .filter((c) => c.postId === postId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function notify(postId: string) {
  listeners.get(postId)?.forEach((fn) => fn(commentsOf(postId)));
}

// 다른 탭에서 댓글이 바뀌어도 반영되도록
window.addEventListener('storage', (e) => {
  if (e.key === COMMENTS_KEY) listeners.forEach((_, postId) => notify(postId));
});

// ── 서비스 구현 ─────────────────────────────────────────────

export const mockDiscussionService: DiscussionService = {
  async listPosts(limit, cursor) {
    const sorted = readPosts().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const start = cursor ? sorted.findIndex((p) => p.id === cursor) + 1 : 0;
    const posts = sorted.slice(start, start + limit);
    const hasMore = start + limit < sorted.length;
    return delay({ posts, nextCursor: hasMore ? posts[posts.length - 1].id : null });
  },

  async getPost(id) {
    return delay(readPosts().find((p) => p.id === id) ?? null);
  },

  async createPost(input, author) {
    const now = new Date().toISOString();
    const post: Post = {
      ...input,
      id: newId(),
      authorUid: author.uid,
      authorName: author.name,
      createdAt: now,
      updatedAt: now,
    };
    write(POSTS_KEY, [...readPosts(), post]);
    return delay(post);
  },

  async updatePost(id, input) {
    const posts = readPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index < 0) throw new Error('글을 찾을 수 없습니다.');
    const updated: Post = { ...posts[index], ...input, updatedAt: new Date().toISOString() };
    posts[index] = updated;
    write(POSTS_KEY, posts);
    return delay(updated);
  },

  async deletePost(id) {
    write(POSTS_KEY, readPosts().filter((p) => p.id !== id));
    write(COMMENTS_KEY, readComments().filter((c) => c.postId !== id));
    return delay(undefined);
  },

  async listComments(postId) {
    return delay(commentsOf(postId));
  },

  async addComment(postId, body, author) {
    const comment: Comment = {
      id: newId(),
      postId,
      body,
      authorUid: author.uid,
      authorName: author.name,
      createdAt: new Date().toISOString(),
    };
    write(COMMENTS_KEY, [...readComments(), comment]);
    notify(postId);
    return delay(comment);
  },

  async deleteComment(postId, commentId) {
    write(COMMENTS_KEY, readComments().filter((c) => c.id !== commentId));
    notify(postId);
    return delay(undefined);
  },

  subscribeComments(postId, callback) {
    if (!listeners.has(postId)) listeners.set(postId, new Set());
    listeners.get(postId)!.add(callback);
    // Firestore onSnapshot 처럼 구독 직후 현재 댓글을 한 번 보내 준다
    callback(commentsOf(postId));
    return () => {
      listeners.get(postId)?.delete(callback);
    };
  },
};
