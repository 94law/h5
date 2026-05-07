<template>
  <VanPopup
    v-bind="vanPopupProps"
    v-model:show="modelValue"
    :class="[
      'x-popup',
      {
        'x-popup--safe-area-inset-top': safeAreaInsetTop,
        'x-popup--safe-area-inset-bottom': safeAreaInsetBottom,
      },
    ]"
    ref="popup"
  >
    <div class="x-popup-inner">
      <div class="x-popup__header" ref="header" v-if="hasNavBar || $slots.header">
        <VanNavBar v-if="hasNavBar">
          <template #title>
            <slot name="title">{{ title }}</slot>
          </template>
          <template #right v-if="$slots.action">
            <slot name="action"></slot>
          </template>
        </VanNavBar>
        <slot name="header"></slot>
      </div>
      <div class="x-popup__content" :style="{ height: contentHeight }">
        <slot></slot>
      </div>
      <div class="x-popup__footer" v-if="$slots.footer" ref="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </VanPopup>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue';
import type { Popup, PopupProps } from 'vant';
import { omit } from 'lodash-es';

defineOptions({
  name: 'XPopup',
});

const modelValue = defineModel<boolean>();

const props = withDefaults(
  defineProps<
    Partial<PopupProps> & {
      title?: string;
    }
  >(),
  {
    overlay: true,
    closeOnClickOverlay: true,
    closeIconPosition: 'top-right',
  },
);

const vanPopupProps = omit(props, ['title']);

const popup = ref<InstanceType<typeof Popup> | null>(null);
const popupRef = computed<Ref<HTMLDivElement>>(() => (popup.value as any)?.popupRef);

defineExpose({
  popupRef,
});

const slots = useSlots();

const hasNavBar = computed(() => {
  return slots.title || (props.title != null && props.title !== '') || slots.action;
});

const header = ref<HTMLDivElement | null>(null);
const footer = ref<HTMLDivElement | null>(null);
const contentHeight = ref('auto');
// 计算内容区域高度
// TODO: flex: 1在部分iOS机型上没有效果
watch(
  () => modelValue.value,
  (visible) => {
    if (visible) {
      nextTick(() => {
        let otherHeight = 0;

        if (header.value) {
          otherHeight += header.value.clientHeight;
        }
        if (footer.value) {
          otherHeight += footer.value.clientHeight;
        }

        if (otherHeight > 0) {
          contentHeight.value = `calc(100% - ${otherHeight}px)`;
        }
      });
    }
  },
);
</script>

<style lang="postcss">
.x-popup {
  & .van-hairline--bottom::after {
    border: none;
  }

  & .van-popup__close-icon {
    font-size: 18px;
  }

  & .van-popup__close-icon--top-center,
  & .van-popup__close-icon--bottom-center {
    left: 50%;
    transform: translateX(-50%);
    font-size: 26px;
  }

  & .van-popup__close-icon--bottom-center {
    bottom: 0;
  }

  & .van-popup__close-icon--top-center {
    top: 0;
  }

  & .van-popup__close-icon--top-left {
    left: 27px;
    top: 30px;
    color: var(--important-color);
  }

  & .van-popup__close-icon--top-right {
    color: var(--important-color);
    top: 30px;
    right: 27px;
  }
}

.x-popup--safe-area-inset-top {
  padding-top: var(--safe-area-inset-top);
  box-sizing: border-box;

  & .van-popup__close-icon {
    margin-top: var(--safe-area-inset-top);
    top: 24px;
    left: 24px;
  }
}

.x-popup--safe-area-inset-bottom {
  padding-bottom: var(--safe-area-inset-bottom);
  box-sizing: border-box;

  & .van-popup__close-icon {
    margin-bottom: var(--safe-area-inset-bottom);
  }
}

.x-popup-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.x-popup__header {
  background: #fff;

  & .van-nav-bar__content {
    height: 76px;
    line-height: 76px;

    /* padding: 30px 27px; */

    & .van-nav-bar__title {
      font-size: var(--title-font-size);
      font-weight: var(--font-weight-medium);
      color: var(--important-color);
      line-height: 22px;
    }
  }
}

.x-popup__content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.x-popup__footer {
  background-color: #fff;
}
</style>
