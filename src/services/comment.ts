import axios from '@/shared/axios';
import type { CommentItem, CommentRaw } from '@/types/community';
import { toCommentItem } from '@/types/community';

/** 服务端返回的评论列表原始格式 */
interface CommentListResultRaw {
  items: CommentRaw[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** 前端使用的评论列表格式 */
export interface CommentListResult {
  items: CommentItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 获取评论列表（分页）
 */
export async function getComments(params: {
  postId: number;
  page?: number;
  pageSize?: number;
}): Promise<CommentListResult> {
  const { postId, ...rest } = params;
  const response = await axios.get(`/community/posts/${postId}/comments`, {
    params: rest,
    __interceptorOptions__: {
      security: false,
      redirectToLogin: false,
    },
  });
  const raw = response as CommentListResultRaw;
  return {
    ...raw,
    items: raw.items.map(toCommentItem),
  };
}

/**
 * 发表评论
 */
export async function createComment(params: {
  postId: number;
  content: string;
}): Promise<CommentItem> {
  const { postId, ...rest } = params;
  const response = await axios.post(
    `/community/posts/${postId}/comments`,
    rest,
    {
      __interceptorOptions__: {
        security: true,
      },
    },
  );
  return toCommentItem(response as CommentRaw);
}
