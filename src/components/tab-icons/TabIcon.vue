<template>
  <svg
    :class="$style.icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 首页图标 -->
    <template v-if="name === 'home'">
      <path
        v-if="active"
        d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z"
        :fill="activeColor"
        stroke="none"
      />
      <path
        v-else
        d="M3 9.5L12 3L21 9.5"
        :stroke="inactiveColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        v-if="!active"
        d="M5 10V20H9V14H15V20H19V10"
        :stroke="inactiveColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- 圈子图标 -->
    <template v-else-if="name === 'community'">
      <!-- 底部的水平弧线 -->
      <path
        v-if="active"
        d="M3 18C3 15.7909 4.79086 14 7 14H8C10.2091 14 12 15.7909 12 18V19H3V18Z"
        :fill="activeColor"
      />
      <path
        v-if="active"
        d="M12 18C12 15.7909 13.7909 14 16 14H17C19.2091 14 21 15.7909 21 18V19H12V18Z"
        :fill="activeColor"
      />
      <circle v-if="active" cx="7.5" cy="9" r="3" :fill="activeColor" />
      <circle v-if="active" cx="16.5" cy="9" r="3" :fill="activeColor" />
      <template v-else>
        <path
          d="M3 18C3 15.7909 4.79086 14 7 14H8C10.2091 14 12 15.7909 12 18V19"
          :stroke="inactiveColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 18C12 15.7909 13.7909 14 16 14H17C19.2091 14 21 15.7909 21 18V19"
          :stroke="inactiveColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle
          cx="7.5" cy="9" r="3"
          :stroke="inactiveColor"
          stroke-width="1.8"
          fill="none"
        />
        <circle
          cx="16.5" cy="9" r="3"
          :stroke="inactiveColor"
          stroke-width="1.8"
          fill="none"
        />
      </template>
    </template>

    <!-- 我的图标 -->
    <template v-else-if="name === 'profile'">
      <circle
        v-if="active"
        cx="12" cy="8" r="4"
        :fill="activeColor"
      />
      <path
        v-if="active"
        d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z"
        :fill="activeColor"
      />
      <template v-else>
        <circle
          cx="12" cy="8" r="4"
          :stroke="inactiveColor"
          stroke-width="1.8"
          fill="none"
        />
        <path
          d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21"
          :stroke="inactiveColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
      </template>
    </template>
  </svg>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    name: string;
    active?: boolean;
    size?: number;
    activeColor?: string;
    inactiveColor?: string;
  }>(),
  {
    active: false,
    size: 24,
    activeColor: '#4d69ff',
    inactiveColor: '#999',
  },
);
</script>

<style lang="postcss" module>
.icon {
  display: block;
  flex-shrink: 0;
}
</style>
