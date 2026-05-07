import { nextTick } from 'vue';
import type { Router } from 'vue-router';
import { getTitle } from '@/shared/util';

export default function titleGuard(router: Router) {
  /**
   * 若当前路由存在title，则优先使用当前路由的title，否则设置为默认的title
   * @see https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
   */
  router.afterEach((to) => {
    nextTick(() => {
      document.title = getTitle(to);
    });
  });
}
