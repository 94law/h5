<template>
  <section :class="$style.container">
    <div :class="$style.content">
      <RouterView />
    </div>
    <VanTabbar
      v-model="activeTab"
      :class="$style.tabbar"
      :border="true"
      safe-area-inset-bottom
      fixed
      placeholder
    >
      <VanTabbarItem v-for="tab in tabs" :key="tab.name" :name="tab.name" :to="tab.to" replace>
        <template #icon="props">
          <TabIcon :name="tab.icon" :active="props.active" :size="24" />
        </template>
        <span :class="[$style.tabLabel, { [$style.tabLabelActive]: activeTab === tab.name }]">
          {{ tab.label }}
        </span>
      </VanTabbarItem>
    </VanTabbar>
  </section>
</template>

<script lang="ts" setup>
import TabIcon from '@/components/tab-icons/TabIcon.vue';

const route = useRoute();

const tabs = [
  { name: 'lawyers', label: '首页', icon: 'home', to: '/lawyers' },
  { name: 'community', label: '圈子', icon: 'community', to: '/community' },
  { name: 'profile', label: '我的', icon: 'profile', to: '/profile' },
];

const activeTab = computed(() => {
  const path = route.path;
  if (path.startsWith('/community')) return 'community';
  if (path.startsWith('/profile')) return 'profile';
  return 'lawyers';
});
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  display: flex;
  flex-direction: column;
  padding-top: env(safe-area-inset-top);
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.tabbar {
  :global {
    .van-tabbar-item__icon {
      margin-bottom: 0;
    }

    .van-tabbar-item--active {
      color: var(--primary-color);
    }
  }
}

.tabLabel {
  font-size: 10px;
  color: #999;
  transition: color 0.2s;
}

.tabLabelActive {
  color: var(--primary-color);
}
</style>
