import axios from '@/shared/axios';
import type { CommunityPost, CommunityPostRaw } from '@/types/community';
import { toCommunityPost } from '@/types/community';

/** 服务端返回的收藏列表原始格式 */
interface FavoriteListResultRaw {
  items: (CommunityPostRaw & { favoritedAt: string })[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** 前端使用的收藏列表格式 */
interface FavoriteListResult {
  items: (CommunityPost & { favoritedAt: string })[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * 获取我的收藏列表（分页）
 */
export async function getMyFavorites(params: {
  page?: number;
  pageSize?: number;
}): Promise<FavoriteListResult> {
  const response = await axios.get('/favorites', {
    params,
    __interceptorOptions__: {
      security: true,
    },
  });
  const raw = response as FavoriteListResultRaw;
  return {
    ...raw,
    items: raw.items.map((item) => ({
      ...toCommunityPost(item),
      favoritedAt: item.favoritedAt,
    })),
  };
}

/**
 * 添加收藏
 */
export async function addFavorite(postId: number): Promise<{ favorited: boolean }> {
  return axios.post(`/favorites/${postId}`, null, {
    __interceptorOptions__: {
      security: true,
    },
  });
}

/**
 * 取消收藏
 */
export async function removeFavorite(postId: number): Promise<{ favorited: boolean }> {
  return axios.delete(`/favorites/${postId}`, {
    __interceptorOptions__: {
      security: true,
    },
  });
}

/**
 * 检查是否已收藏
 */
export async function checkFavorited(postId: number): Promise<boolean> {
  const result = await axios.get(`/favorites/${postId}/status`, {
    __interceptorOptions__: {
      security: true,
      redirectToLogin: false,
    },
  });
  return (result as { favorited: boolean }).favorited;
}
