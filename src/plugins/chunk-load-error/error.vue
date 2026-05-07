<template>
  <div :class="$style.container" @click="onRefresh">
    <img src="@/assets/img/offline.preload.png" alt="" />
    <p>页面加载异常，点击刷新重试</p>
  </div>
</template>
<script lang="ts" setup>
const route = useRoute();

const onRefresh = () => {
  const { target } = route.query;
  if (target == null) {
    return;
  }

  const { origin } = window.location;
  window.location.replace(`${origin}${decodeURIComponent(target as string)}`);
};
</script>

<style lang="postcss" module>
.container {
  width: 100%;
  height: var(--viewport-height);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: opacity 0.3s ease;

  & img {
    margin-top: -100px;
    width: 220px;
  }

  & p {
    margin-top: 10px;
    color: var(--important-color);
  }

  &:active {
    opacity: 0.5;
  }
}
</style>
