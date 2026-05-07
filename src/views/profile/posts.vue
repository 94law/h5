<template>
  <section :class="$style.container">
    <VanPullRefresh v-model="refreshing" @refresh="onRefresh">
      <VanList
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="post in posts" :key="post.id" :class="$style.postCard">
          <div :class="$style.postHeader">
            <h3 :class="$style.title" @click="goDetail(post.id)">{{ post.title }}</h3>
            <span
              v-if="post.reviewStatus"
              :class="[$style.reviewBadge, $style['reviewBadge--' + post.reviewStatus]]"
            >
              {{ statusLabel(post.reviewStatus) }}
            </span>
          </div>
          <p :class="$style.content" @click="goDetail(post.id)">{{ post.content }}</p>
          <div :class="$style.meta">
            <span>{{ post.createTime }}</span>
            <span :class="$style.stats">
              <VanIcon name="good-job-o" size="14" />
              {{ post.likeCount }}
              <VanIcon name="chat-o" size="14" :class="$style.statIcon" />
              {{ post.commentCount }}
            </span>
          </div>
          <div :class="$style.actions">
            <VanButton
              size="small"
              type="danger"
              plain
              icon="delete-o"
              @click.stop="onDelete(post)"
            >
              删除
            </VanButton>
          </div>
        </div>
      </VanList>
    </VanPullRefresh>

    <VanEmpty v-if="!loading && posts.length === 0" description="还没有发布过内容" />
  </section>
</template>

<script lang="ts" setup>
import { showConfirmDialog, showToast } from 'vant';
import * as communityService from '@/services/community';

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '审核中',
    approved: '已通过',
    rejected: '未通过',
  };
  return map[status] || status;
};

const router = useRouter();

const posts = ref<any[]>([]);
const page = ref(1);
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);

const fetchPosts = async (reset = false) => {
  if (reset) {
    page.value = 1;
    finished.value = false;
  }
  loading.value = true;
  try {
    const result = await communityService.getMyPostList({
      page: page.value,
      pageSize: 10,
    });
    if (reset) {
      posts.value = result.items;
    } else {
      posts.value.push(...result.items);
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
  await fetchPosts();
};

const onRefresh = async () => {
  refreshing.value = true;
  await fetchPosts(true);
  refreshing.value = false;
};

const goDetail = (id: string) => {
  router.push(`/community/${id}?mine=1`);
};

const onDelete = async (post: any) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '删除后无法恢复，确定要删除这条发布吗？',
      confirmButtonText: '删除',
      confirmButtonColor: '#ee0a24',
    });
  } catch {
    return; // 取消
  }
  try {
    await communityService.deletePost(Number(post.id));
    posts.value = posts.value.filter((p) => p.id !== post.id);
    showToast({ message: '删除成功', icon: 'success' });
  } catch {
    showToast('删除失败，请稍后重试');
  }
};
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  background: #f7f8fa;
  padding-bottom: env(safe-area-inset-bottom);
}

.postCard {
  margin: 8px 12px;
  padding: 14px;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.postHeader {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.title {
  margin: 0;
  flex: 1;
  font-size: 16px;
  font-weight: var(--font-weight-semi-bold);
  color: var(--important-title-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reviewBadge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  line-height: 1.6;
  flex-shrink: 0;
  white-space: nowrap;
}

.reviewBadge--pending {
  color: #e6a23c;
  background: #fef0d0;
}

.reviewBadge--approved {
  color: #67c23a;
  background: #e1f3d8;
}

.reviewBadge--rejected {
  color: #f56c6c;
  background: #fde2e2;
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

.actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
