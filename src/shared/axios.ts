import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { showFailToast, showToast } from 'vant';
import { BizCode } from '@/shared/constants';
import { isPlainObject } from 'lodash-es';
import { useUserStore } from '@/stores/modules/user';
import PUBLIC_KEY from '@/publicKey';
import FullscreenLoading from '@/components/loading/fullscreen';

const BIZ_ERROR = 'BizError';

// 生产环境和预发布环境都当作正式环境
const isFormal =
  import.meta.env.VITE_APP_RUNTIME_ENV === 'prod' ||
  import.meta.env.VITE_APP_RUNTIME_ENV === 'staging';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_PREFIX}api`,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

/**
 * 控制台统一输出异常
 * @param {Error} error
 */
function outputError(error: Required<Error>) {
  const { response } = error;
  const config = (response as AxiosResponse).config;

  // eslint-disable-next-line no-console
  console.error(
    '%s\n url: %s\n method: %s\n params: %s\n response: %s',
    error.message,
    config.url,
    config.method,
    JSON.stringify(config.data || config.params || null),
    JSON.stringify(response.data),
  );
}

/**
 * 登录失效去登录页
 */
function goToLogin() {
  const { pathname, search, hash } = window.location;
  const fullPath = pathname + search + hash;

  // eslint-disable-next-line no-underscore-dangle
  window.__g_router__.replace({
    path: '/login',
    query: {
      redirect: fullPath,
    },
  });
}

/**
 * 用户信息设置
 */
instance.interceptors.request.use(async (config) => {
  // eslint-disable-next-line no-underscore-dangle
  const loading = config.__interceptorOptions__?.loading ?? true;

  if (loading) {
    FullscreenLoading.show();
  }

  const { token, isLogin } = useUserStore();

  if (config.headers) {
    if (isLogin && token != null) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

/**
 * 处理业务状态码
 */
instance.interceptors.response.use(
  async (response) => {
    const {
      loading = true,
      toast = true,
      redirectToLogin = true,
    } = response.config?.__interceptorOptions__ ?? {};

    if (loading) {
      FullscreenLoading.hide();
    }

    const result: { code: BizCode; msg: string; data?: any } = response.data;

    if (result.code === BizCode.SUCCESS) {
      return result.data;
    }

    const error = new Error(
      `Request failed with biz status code ${result.code}${result.msg ? `, ${result.msg}` : ''}`,
    );

    error.name = BIZ_ERROR;
    error.response = response;

    if (!isFormal) {
      outputError(error as Required<Error>);
    }

    // 未登录或登录失效
    if (result.code === BizCode.UNAUTHORIZED) {
      const userStore = useUserStore();
      await userStore.logout();

      // 显示后端返回的错误信息
      if (toast && result.msg) {
        showToast(result.msg);
      }

      if (redirectToLogin) {
        goToLogin();
      }
    } else if (toast) {
      showToast(result.msg || '未知错误');
    }

    return Promise.reject(error);
  },
  async (error: Required<Error>) => {
    FullscreenLoading.hide();

    if (!isPlainObject(error.response)) {
      showFailToast('网络连接异常，请检查网络后重试');
      return Promise.reject(error);
    }

    const { status, statusText, config } = error.response as AxiosResponse;
    const { toast = true, redirectToLogin = true } = config?.__interceptorOptions__ ?? {};

    if (status === 401) {
      const userStore = useUserStore();
      await userStore.logout();

      // 显示后端返回的错误信息
      const backendMsg = (error.response as AxiosResponse)?.data?.msg;
      if (toast && backendMsg) {
        showFailToast(backendMsg);
      }

      if (redirectToLogin) {
        goToLogin();
      }
    } else if (status === 404) {
      // 资源不存在：优先显示后端中文错误消息
      const backendMsg = (error.response as AxiosResponse)?.data?.msg;
      if (toast) {
        showFailToast(backendMsg || '请求的资源不存在');
      }
    } else if (status === 409) {
      // 资源冲突（如重复注册）：优先显示后端中文错误消息
      const backendMsg = (error.response as AxiosResponse)?.data?.msg;
      if (toast) {
        showFailToast(backendMsg || '资源冲突，请检查后重试');
      }
    } else if (toast) {
      if (status === 403) {
        showFailToast('无权限访问');
      } else {
        const backendMsg = (error.response as AxiosResponse)?.data?.msg;
        showFailToast(backendMsg || statusText || '未知错误');
      }
    }

    if (!isFormal) {
      outputError(error);
    }

    return Promise.reject(error);
  },
);

export default instance;
