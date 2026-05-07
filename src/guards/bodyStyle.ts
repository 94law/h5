import { existsNavBar } from '@/shared/util';
import type { Router } from 'vue-router';

export default function bodyStyleGuard(router: Router) {
  /**
   * 切换路由后设置body样式
   */
  router.afterEach((to) => {
    if (existsNavBar(to)) {
      document.body.classList.add('has-nav-bar');
    } else {
      document.body.classList.remove('has-nav-bar');
    }

    document.body.style.background = (to.meta?.background as string) ?? '#fff';
  });
}
