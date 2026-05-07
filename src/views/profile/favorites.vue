<template>
  <section :class="$style.container">
    <VanPullRefresh
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <VanList
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="item in favorites"
          :key="item.id"
          :class="$style.favCard"
          @click="goDetail(item.id)"
        >
          <div :class="$style.favBody">
            <h3 :class="$style.title">{{ item.title }}</h3>
            <p :class="$style.content">{{ item.content }}</p>
            <div :class="$style.meta">
              <span>{{ item.createTime }}</span>
              <span :class="$style.stats">
                <VanIcon name="good-job-o" size="14" />
                {{ item.likeCount }}
                <VanIcon name="chat-o" size="14" :class="$style.statIcon" />
                {{ item.commentCount }}
              </span>
            </div>
          </div>
          <VanIcon
            name="cross"
            size="16"
            color="#ccc"
            :class="$style.removeBtn"
            @click.stop="onRemove(item)"
          />
        </div>
      </VanList>
    </VanPullRefresh>

    <VanEmpty v-if="!loading && favorites.length === 0" description="还没有收藏内容" />
  </section>
</template>

<script lang="ts" setup>
import { showConfirmDialog, showToast } from 'vant';
import * as favoriteService from '@/services/favorite';

const router = useRouter();

const favorites = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);

const fetchFavorites = async (reset = false) => {
  if (reset) {
    page.value = 1;
    finished.value = false;
  }
  loading.value = true;
  try {
    const result = await favoriteService.getMyFavorites({
      page: page.value,
      pageSize: 10,
    });
    if (reset) {
      favorites.value = result.items;
    } else {
      favorites.value.push(...result.items);
    }
    finished.value = !result.hasMore;
    if (result.hasMore) {
      page.value += 1;
    }
  } catch {
    showToast('加载失败');
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

const onLoad = async () => {
  await fetchFavorites();
};

const onRefresh = async () => {
  refreshing.value = true;
  await fetchFavorites(true);
  refreshing.value = false;
};

const onRemove = async (item: any) => {
  try {
    await showConfirmDialog({
      title: '取消收藏',
      message: '确定要取消收藏该内容吗？',
    });
    await favoriteService.removeFavorite(Number(item.id));
    favorites.value = favorites.value.filter((f) => f.id !== item.id);
    showToast({ message: '已取消收藏', icon: 'success' });
  } catch {
    // 用户取消
  }
};

const goDetail = (id: string) => {
  router.push(`/community/${id}`);
};
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  background: #f7f8fa;
  padding-bottom: env(safe-area-inset-bottom);
}

.favCard {
  margin: 8px 12px;
  padding: 14px;
  background: #fff;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.favBody {
  flex: 1;
  min-width: 0;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: var(--font-weight-semi-bold);
  color: var(--important-title-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--paragraph-color);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--unimportant-color);
}

.stats {
  display: flex;
  align-items: center;
  gap: 4px;
}

.statIcon {
  margin-left: 10px;
}

.removeBtn {
  flex-shrink: 0;
  margin-top: 2px;
  padding: 8px;
  cursor: pointer;
}
</style>
