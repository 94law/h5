import axios from '@/shared/axios';
import type { CommunityPost, CommunityPostRaw } from '@/types/community';
import { toCommunityPost } from '@/types/community';

/** 服务端返回的列表原始格式 */
interface PostListResultRaw {
  items: CommunityPostRaw[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** 前端使用的列表格式 */
interface PostListResult {
  items: CommunityPost[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface LikeResult {
  liked: boolean;
  likeCount: number;
}

/**
 * 获取案例列表（分页）
 */
export async function getPostList(params: {
  page?: number;
  pageSize?: number;
}): Promise<PostListResult> {
  const response = await axios.get('/community/posts', {
    params,
    __interceptorOptions__: {
      security: false,
      redirectToLogin: false,
    },
  });
  const raw = response as PostListResultRaw;
  return {
    ...raw,
    items: raw.items.map(toCommunityPost),
  };
}

/**
 * 获取我的发布列表（分页）
 */
export async function getMyPostList(params: {
  page?: number;
  pageSize?: number;
}): Promise<PostListResult> {
  const response = await axios.get('/community/posts/mine', {
    params,
    __interceptorOptions__: {
      security: true,
    },
  });
  const raw = response as PostListResultRaw;
  return {
    ...raw,
    items: raw.items.map(toCommunityPost),
  };
}

/**
 * 获取案例详情。若 asOwner 为 true 则携带用户 token，
 * 服务端识别为帖子所有者时会跳过审核状态过滤。
 */
export async function getPostDetail(id: number, asOwner = false): Promise<CommunityPost> {
  const response = await axios.get(`/community/posts/${id}`, {
    __interceptorOptions__: {
      security: asOwner,
      redirectToLogin: false,
    },
  });
  return toCommunityPost(response as CommunityPostRaw);
}

/**
 * 发布案例
 */
export async function createPost(params: {
  title: string;
  content: string;
  images?: string[];
  lawyerName?: string;
}): Promise<CommunityPost> {
  const response = await axios.post('/community/posts', params, {
    __interceptorOptions__: {
      security: true,
    },
  });
  return toCommunityPost(response as CommunityPostRaw);
}

/**
 * 点赞案例
 */
export async function likePost(id: number): Promise<LikeResult> {
  const response = await axios.post(`/community/posts/${id}/like`, null, {
    __interceptorOptions__: {
      security: true,
    },
  });
  return response as LikeResult;
}

/**
 * 删除自己的帖子
 */
export async function deletePost(id: number): Promise<void> {
  await axios.delete(`/community/posts/${id}`, {
    __interceptorOptions__: {
      security: true,
    },
  });
}
