<template>
  <span ref="countup"></span>
</template>

<script lang="ts" setup>
import { CountUp, type CountUpOptions } from 'countup.js';
import { isFinite } from 'lodash-es';

defineOptions({
  name: 'XCountUp',
});

const props = withDefaults(
  defineProps<{
    endVal?: number;
    autoplay?: boolean;
    delay?: number;
    options?: CountUpOptions;
  }>(),
  {
    endVal: 0,
    autoplay: true,
    delay: 300,
  },
);

let instance: CountUp | null = null;

// @exposed-api
const printValue = (value: number) => {
  if (!instance) return;
  instance.printValue(value);
};

// @exposed-api
const start = (callback?: (args?: any) => any) => {
  if (!instance) return;
  instance.start(callback);
};

// @exposed-api
const pauseResume = () => {
  if (!instance) return;
  instance.pauseResume();
};

// @exposed-api
const reset = () => {
  if (!instance) return;
  instance.reset();
};

// @exposed-api
const update = (newEndVal: string | number) => {
  if (!instance) return;
  instance.update(newEndVal);
};

// @exposed-api
const destroy = () => {
  instance = null;
};

const countup = ref<HTMLSpanElement | null>(null);
onMounted(() => {
  if (countup.value == null) {
    return;
  }

  instance = new CountUp(countup.value, props.endVal, {
    duration: 1.5,
    separator: '',
    ...props.options,
  });

  if (props.autoplay) {
    setTimeout(() => {
      start();
    }, props.delay);
  }
});

onBeforeMount(() => {
  destroy();
});

watch(
  () => {
    return props.endVal;
  },
  (v) => {
    if (!isFinite(v)) return;
    update(v);
  },
);

defineExpose({
  printValue,
  start,
  pauseResume,
  reset,
  update,
  destroy,
});
</script>
