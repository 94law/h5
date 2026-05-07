import ChunkLoadError from './error.vue';
import type { Plugin } from 'vue';
import type { Router, RouteLocationNormalized } from 'vue-router';

export interface ChunkLoadErrorOptions {
  router: Router;
}

function installChunkLoadErrorHandler(router: Router) {
  router.addRoute({
    path: '/error/chunk-load',
    name: 'ChunkLoadError',
    meta: {
      title: '页面加载异常',
    },
    component: ChunkLoadError,
  });

  let isReplace = false;

  const originalReplace = router.replace;
  router.replace = (...args: any) => {
    isReplace = true;
    return originalReplace.apply(router, args);
  };

  router.afterEach(() => {
    isReplace = false;
  });

  /**
   * 处理模块加载异常的错误
   */
  router.onError((error) => {
    console.log(error.message);
    const isLoadChunkError = /Loading\s(?:[^\s]*\s)?chunk\s(?:[^\s]*\s)?failed/i.test(
      error.message,
    );

    if (isLoadChunkError) {
      // @ts-expect-error It's not an error
      const history = router.history;
      const fullPath = (history.pending as RouteLocationNormalized)?.fullPath;
      const isSamePath = (history.current as RouteLocationNormalized).path === '/error/chunk-load';

      if (fullPath && !isSamePath) {
        const target = {
          path: '/error/chunk-load',
          query: {
            target: fullPath,
          },
        };

        if (isReplace) {
          router.replace(target);
          return;
        }

        router.push(target);
      }
    }
  });
}

export default {
  install(Vue, options) {
    const { router } = options ?? {};

    if (!router) {
      throw new Error('ChunkLoadError need options.router');
    }

    installChunkLoadErrorHandler(router);
  },
} as Plugin<ChunkLoadErrorOptions>;
