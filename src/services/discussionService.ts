// ─────────────────────────────────────────────────────────────
// 토론 게시판 서비스 계층
// 화면(pages)은 반드시 이 파일의 discussionService 만 사용합니다.
// 저장 방식(localStorage → Firestore)을 바꿔도 화면 코드는 그대로 둘 수 있습니다.
// ─────────────────────────────────────────────────────────────

import type { Comment, Post, PostInput, User } from '../types';
import { mockDiscussionService } from './mockDiscussionService';

/** 목록 "더 보기"용 위치 표시. 화면에서는 내용을 해석하지 말고 그대로 다시 넘기기만 합니다. */
export type PostCursor = string;

export interface PostPage {
  posts: Post[];
  nextCursor: PostCursor | null; // null 이면 더 불러올 글이 없음
}

/** 글쓴이 정보 (로그인 사용자에서 필요한 부분만) */
export type Author = Pick<User, 'uid' | 'name'>;

export interface DiscussionService {
  /** 최신 글부터 limit 개. cursor 를 넘기면 그 다음 글부터 */
  listPosts(limit: number, cursor?: PostCursor | null): Promise<PostPage>;
  /** 글 하나. 없으면 null */
  getPost(id: string): Promise<Post | null>;
  createPost(input: PostInput, author: Author): Promise<Post>;
  updatePost(id: string, input: PostInput): Promise<Post>;
  /** 글과 그 글의 댓글을 함께 삭제 */
  deletePost(id: string): Promise<void>;
  /** 오래된 댓글부터 */
  listComments(postId: string): Promise<Comment[]>;
  addComment(postId: string, body: string, author: Author): Promise<Comment>;
  deleteComment(postId: string, commentId: string): Promise<void>;
  /**
   * 댓글 실시간 구독. 댓글이 바뀔 때마다 callback 이 호출되고,
   * 반환된 함수를 호출하면 구독을 끝냅니다. (2단계에서 Firestore onSnapshot 으로 구현)
   */
  subscribeComments(postId: string, callback: (comments: Comment[]) => void): () => void;
}

// TODO(Phase2): firestoreDiscussionService 를 만든 뒤 아래 한 줄만 교체합니다.
export const discussionService: DiscussionService = mockDiscussionService;
