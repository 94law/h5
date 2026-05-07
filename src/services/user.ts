import type { paths } from '@/schemas/mock';
import axios from '@/shared/axios';

export type Login = DefineService<paths, '/user/login'>;

/**
 * 登录（手机号 + 密码）
 */
export function login(params: { account: string; password: string }): Promise<{ accessToken: string }> {
  return axios.post(
    '/auth/login',
    {
      account: params.account,
      password: params.password,
    },
    {
      __interceptorOptions__: {
        security: true,
      },
    },
  );
}

export type RegisterParams = {
  phone: string;
  nickname: string;
  password: string;
  email?: string;
};

/**
 * 注册
 */
export function register(params: RegisterParams): Promise<{ accessToken: string }> {
  return axios.post(
    '/auth/register',
    {
      phone: params.phone,
      nickname: params.nickname,
      password: params.password,
      email: params.email,
    },
    {
      __interceptorOptions__: {
        security: true,
      },
    },
  );
}

/**
 * 查询用户信息
 */
export interface QueryProfileResult {
  id?: number;
  phone?: string;
  nickname?: string;
  username?: string;
  gender?: number;
  avatar?: string;
  email?: string;
  status?: string;
}

export type QueryProfileType = {
  Params: void;
  Result: QueryProfileResult;
};

export function queryProfile(options?: {
  redirectToLogin?: boolean;
}): Promise<QueryProfileResult> {
  return axios.get('/users/me', {
    __interceptorOptions__: {
      security: true,
      redirectToLogin: options?.redirectToLogin ?? false,
    },
  });
}

/**
 * 退出（JWT 无状态，客户端清除 token 即可）
 */
export function logout(): Promise<void> {
  return Promise.resolve();
}
/**
 * 上传文件（头像等）
 */
export function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    __interceptorOptions__: {
      security: true,
    },
  });
}

/**
 * 更新用户资料（昵称/性别/头像）
 */
export function updateProfile(params: {
  nickname?: string;
  gender?: number;
  avatar?: string;
  email?: string;
}): Promise<QueryProfileType['Result']> {
  return axios.patch('/users/me', params, {
    __interceptorOptions__: {
      security: true,
    },
  });
}

/**
 * 修改密码
 */
export function changePassword(params: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ success: boolean }> {
  return axios.post('/users/me/change-password', params, {
    __interceptorOptions__: {
      security: true,
    },
  });
}

