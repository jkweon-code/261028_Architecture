// ─────────────────────────────────────────────────────────────
// 토론 서비스: Cloud Firestore
//  posts/{postId}                      글
//  posts/{postId}/comments/{commentId} 댓글
// 무료 읽기 한도를 아끼기 위해 목록은 필요한 만큼만 읽고,
// 실시간 리스너(onSnapshot)는 글 상세의 댓글에만 씁니다.
// ─────────────────────────────────────────────────────────────

import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit as limitTo,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  writeBatch,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { requireDb } from '../lib/firebase';
import { toIso } from '../lib/timestamp';
import type { Comment, Post } from '../types';
import type { DiscussionService } from './discussionService';

const postsCol = () => collection(requireDb(), 'posts');
const postRef = (id: string) => doc(requireDb(), 'posts', id);
const commentsCol = (postId: string) => collection(requireDb(), 'posts', postId, 'comments');

function toPost(snap: DocumentSnapshot): Post {
  const d = snap.data({ serverTimestamps: 'estimate' })!;
  return {
    id: snap.id,
    title: d.title,
    body: d.body,
    category: d.category,
    relatedResearchId: d.relatedResearchId || undefined,
    authorUid: d.authorUid,
    authorName: d.authorName,
    createdAt: toIso(d.createdAt),
    updatedAt: toIso(d.updatedAt),
  };
}

function toComment(postId: string, snap: DocumentSnapshot): Comment {
  const d = snap.data({ serverTimestamps: 'estimate' })!;
  return {
    id: snap.id,
    postId,
    body: d.body,
    authorUid: d.authorUid,
    authorName: d.authorName,
    createdAt: toIso(d.createdAt),
  };
}

// "더 보기" 위치 기억: 마지막으로 받은 글의 id → 그 문서 (추가 읽기 없이 다음 쪽을 이어서 읽기 위해)
const cursorDocs = new Map<string, QueryDocumentSnapshot>();

export const firestoreDiscussionService: DiscussionService = {
  async listPosts(limit, cursor) {
    let after: DocumentSnapshot | undefined = cursor ? cursorDocs.get(cursor) : undefined;
    if (cursor && !after) after = await getDoc(postRef(cursor)); // 기억이 없으면 한 번 읽어 옴

    // limit+1 개를 읽어 다음 쪽이 있는지 확인
    const q = after
      ? query(postsCol(), orderBy('createdAt', 'desc'), startAfter(after), limitTo(limit + 1))
      : query(postsCol(), orderBy('createdAt', 'desc'), limitTo(limit + 1));
    const snap = await getDocs(q);
    const docs = snap.docs.slice(0, limit);
    const hasMore = snap.docs.length > limit;
    const last = docs[docs.length - 1];
    if (hasMore && last) cursorDocs.set(last.id, last);
    return { posts: docs.map(toPost), nextCursor: hasMore && last ? last.id : null };
  },

  async getPost(id) {
    const snap = await getDoc(postRef(id));
    return snap.exists() ? toPost(snap) : null;
  },

  async createPost(input, author) {
    const ref = await addDoc(postsCol(), {
      title: input.title,
      body: input.body,
      category: input.category,
      relatedResearchId: input.relatedResearchId, // undefined 이면 저장하지 않음
      authorUid: author.uid,
      authorName: author.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const now = new Date().toISOString();
    return { ...input, id: ref.id, authorUid: author.uid, authorName: author.name, createdAt: now, updatedAt: now };
  },

  async updatePost(id, input) {
    await updateDoc(postRef(id), {
      title: input.title,
      body: input.body,
      category: input.category,
      // 관련 연구를 "선택 안 함"으로 바꾸면 필드를 지움
      relatedResearchId: input.relatedResearchId ?? deleteField(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(postRef(id));
    return toPost(snap);
  },

  async deletePost(id) {
    // 댓글을 모두 지운 뒤 글을 지움 (한 번에 처리)
    const comments = await getDocs(commentsCol(id));
    const batch = writeBatch(requireDb());
    comments.docs.forEach((c) => batch.delete(c.ref));
    batch.delete(postRef(id));
    await batch.commit();
  },

  async listComments(postId) {
    const snap = await getDocs(query(commentsCol(postId), orderBy('createdAt', 'asc')));
    return snap.docs.map((d) => toComment(postId, d));
  },

  async addComment(postId, body, author) {
    const ref = await addDoc(commentsCol(postId), {
      body,
      authorUid: author.uid,
      authorName: author.name,
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, postId, body, authorUid: author.uid, authorName: author.name, createdAt: new Date().toISOString() };
  },

  async deleteComment(postId, commentId) {
    await deleteDoc(doc(requireDb(), 'posts', postId, 'comments', commentId));
  },

  subscribeComments(postId, callback) {
    return onSnapshot(
      query(commentsCol(postId), orderBy('createdAt', 'asc')),
      (snap) => callback(snap.docs.map((d) => toComment(postId, d))),
      (err) => console.error('[댓글 구독 오류]', err),
    );
  },
};
