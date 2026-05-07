<template>
  <section :class="$style.container">
    <VanNavBar
      v-if="showNavBar"
      :left-arrow="canBack"
      :title="title"
      safe-area-inset-top
      fixed
      placeholder
      :z-index="10"
      @click-left="handleClickLeft"
    >
      <template #right>
        <RouterView name="menu" />
      </template>
    </VanNavBar>
    <div :class="$style.content">
      <RouterView />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { isBoolean } from 'lodash-es';
import { useRouter } from 'vue-router';
import { existsNavBar, getTitle } from '../shared/util';

const router = useRouter();
const route = useRoute();

const showNavBar = computed(() => {
  if (route.meta?.customNavBar === true) {
    return false;
  }

  return existsNavBar(route);
});

const canBack = computed(() => {
  if (isBoolean(route.meta?.canBack)) {
    return route.meta?.canBack;
  }

  return true;
});

const title = computed(() => getTitle(route));

const handleClickLeft = () => {
  router.back();
};
</script>

<style lang="postcss" module>
:global {
  & .van-button--primary {
    font-weight: var(--font-weight-semi-bold);
  }
}

.container {
  min-height: var(--viewport-height);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.content {
  position: relative;
  flex: 1;
}
</style>
