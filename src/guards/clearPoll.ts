import { clearAllPoll } from '@/shared/poll';
import type { Router } from 'vue-router';

export default function clearPollGuard(router: Router) {
  /**
   * 切换路由后清理掉所有轮询
   */
  router.beforeEach((to, from, next) => {
    clearAllPoll();
    next();
  });
}
