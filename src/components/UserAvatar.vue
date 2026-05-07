<template>
  <div
    :class="$style.avatarWrap"
    :style="{ width: pxSize, height: pxSize }"
  >
    <VanImage
      v-if="hasAvatar"
      round
      fit="cover"
      :width="size"
      :height="size"
      :src="avatar ?? undefined"
      :class="$style.avatarImg"
    >
      <template #error>
        <div :class="$style.fallback" :style="fallbackStyle">
          <VanIcon :name="genderIcon" :size="iconSize" :color="iconColor" />
        </div>
      </template>
    </VanImage>
    <div v-else :class="$style.fallback" :style="fallbackStyle">
      <VanIcon :name="genderIcon" :size="iconSize" :color="iconColor" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

/** 性别枚举: 0女 1男 2未知 */
const Gender = {
  Female: 0,
  Male: 1,
  Unknown: 2,
};

const props = withDefaults(defineProps<{
  avatar?: string | null;
  gender?: number | null;
  size?: number;
}>(), {
  avatar: null,
  gender: null,
  size: 40,
});

const pxSize = computed(() => `${props.size}px`);
const iconSize = computed(() => Math.max(14, Math.round(props.size * 0.45)).toString());

const hasAvatar = computed(() => !!props.avatar && props.avatar.length > 0);

const genderIcon = computed(() => {
  if (props.gender === Gender.Male) return 'user-o';
  if (props.gender === Gender.Female) return 'user-o';
  return 'user-o';
});

const iconColor = computed(() => {
  if (props.gender === Gender.Male) return '#4a90d9';
  if (props.gender === Gender.Female) return '#e87da0';
  return '#ccc';
});

const fallbackStyle = computed(() => ({
  width: pxSize.value,
  height: pxSize.value,
  borderRadius: '50%',
  background: props.gender === Gender.Male
    ? '#e8f0fe'
    : props.gender === Gender.Female
    ? '#fde8ef'
    : '#f5f5f5',
}));
</script>

<style lang="postcss" module>
.avatarWrap {
  flex-shrink: 0;
}

.avatarImg {
  display: block;
}

.fallback {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
