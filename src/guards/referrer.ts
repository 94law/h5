import type { Router } from 'vue-router';

export default function referrerGuard(router: Router) {
  /**
   * 切换路由前记录referrer
   */
  router.beforeEach((to, from, next) => {
    const { protocol, host } = window.location;
    window.__vue_router_referrer__ = `${protocol}//${host}${from.fullPath}`;
    next();
  });
}
