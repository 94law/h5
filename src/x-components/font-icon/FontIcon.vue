<template>
  <component
    :is="tag"
    :class="['x-font-icon', { [`x-font-icon-${name}`]: !isImageIcon }]"
    :style="{ color: color, fontSize: addUnit(size) }"
  >
    <slot></slot>
    <img :src="name" alt="" class="x-font-icon__image" v-if="isImageIcon" />
    <span :class="['x-font-icon__badge', { 'x-font-icon__dot': dot }]" v-if="dot || badge">
      {{ badge }}
    </span>
  </component>
</template>

<script lang="ts">
export default {
  name: 'XFontIcon',
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { addUnit } from '@/shared/util';

const props = withDefaults(
  defineProps<{
    name: string;
    dot?: boolean;
    badge?: number | string;
    color?: string;
    size?: number | string;
    tag?: string;
  }>(),
  {
    tag: 'i',
  },
);

defineEmits<{
  click: [e: MouseEvent];
}>();

const isImageIcon = computed(() => (props.name ? props.name.includes('/') : false));
</script>

<style lang="postcss">
@import url(@/assets/fonts/iconfont.css);

.x-font-icon {
  position: relative;
  font-family: iconfont;
  font-style: normal;
  font-weight: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased; /* 修复锯齿问题 */

  &::before {
    display: inline-block;
  }
}

.x-font-icon__image {
  display: block;
  width: 1em;
  height: 1em;
  object-fit: contain;
}

.x-font-icon__badge {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  min-width: 16px;
  padding: 0 3px;
  color: #fff;
  font-weight: var(--font-weight-medium);
  font-size: 12px;
  font-family: -apple-system-font, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.2;
  text-align: center;
  background-color: #ee0a24;
  border: 1px solid #fff;
  border-radius: 16px;
  transform: translate(50%, -50%);
  transform-origin: 100%;
}

.x-font-icon__dot {
  width: 8px;
  height: 8px;
  min-width: 8px;
}
</style>
