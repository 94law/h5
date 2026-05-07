<template>
  <div :style="{ minHeight: `${height}px`, minWidth: `${width}px` }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import ResizeObserver from 'resize-observer-polyfill';

defineOptions({
  name: 'XPlaceholder',
});

const heightList = ref<number[]>([]);
const height = computed(() => heightList.value.reduce((acc, cur) => (acc += cur), 0));

const widthList = ref<number[]>([]);
const width = computed(() => widthList.value.reduce((acc, cur) => (acc += cur), 0));

/**
 * 更新记录的子节点尺寸
 * @param el
 * @param index
 */
const updateSize = (el: HTMLElement, index: number) => {
  const { width, height } = el.getBoundingClientRect();

  widthList.value.splice(index, 1, width);
  heightList.value.splice(index, 1, height);
};

const slots = useSlots();
const elements = ref<Node[]>([]);
const observers = ref<ResizeObserver[]>([]);
onMounted(() => {
  // 获取所有子节点
  elements.value =
    (slots
      .default?.()
      .map((vnode) => vnode.el)
      .filter((v) => v) as Node[]) ?? [];

  // 初始化用于存储子节点宽度及高度的列表
  heightList.value = Array(elements.value.length).fill(0);
  widthList.value = Array(elements.value.length).fill(0);

  // 更新尺寸及创建对应的ResizeObserver
  elements.value.forEach((element, index) => {
    updateSize(element as HTMLElement, index);
    observers.value.push(
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          updateSize(entry.target as HTMLElement, index);
        }
      }),
    );
  });

  observers.value.forEach((observer, index) => {
    observer.observe(elements.value[index] as Element);
  });
});

onBeforeUnmount(() => {
  observers.value.forEach((observer, index) => {
    observer.unobserve(elements.value[index] as Element);
  });
});
</script>
