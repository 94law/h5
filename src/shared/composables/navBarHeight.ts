import { isFinite } from 'lodash-es';
import { existsNavBar } from '@/shared/util';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

/** nav-bar height */
const NAV_BAR_HEIGHT = 70;

export function useNavBarHeight() {
  const route = useRoute();
  const height = computed(() => {
    if (existsNavBar(route)) {
      const safeAreaInsetTop = Number.parseFloat(
        document.documentElement.style.getPropertyValue('--safe-area-inset-top'),
      );

      return NAV_BAR_HEIGHT + (isFinite(safeAreaInsetTop) ? safeAreaInsetTop : 0);
    }
    return 0;
  });

  return height.value;
}
