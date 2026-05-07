import type { Router } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import type { Pinia } from 'pinia';

export default function loginGuard(router: Router, pinia: Pinia) {
  /**
   * 对即将进入的路由判断是否需要登录
   */
  router.beforeEach((to, from, next) => {
    if (to.name === 'NotFound' || to.name === 'ChunkLoadError') {
      next();
      return;
    }
    const userStore = useUserStore(pinia);

    // 如果是登录页的话在已登录状态下跳转到重定向页面或者首页
    if (userStore.isLogin && to.path === '/login') {
      next({
        path: (to.query.redirect as string) ?? '/',
        replace: true,
      });
      return;
    }

    if (userStore.isLogin || to.meta?.excludeLogin) {
      next();
      return;
    }

    next({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
      replace: true,
    });
  });
}
