<template>
  <section :class="$style.container">
    <!-- 顶部操作栏 -->
    <div :class="$style.header">
      <h2 :class="$style.title">圈子</h2>
      <VanButton
        type="primary"
        size="small"
        round
        icon="add-o"
        :class="$style.publishBtn"
        @click="onPublish"
      >
        发布
      </VanButton>
    </div>

    <!-- 案例列表 -->
    <VanList
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="item in posts" :key="item.id" :class="$style.card" @click="onPostClick(item.id)">
        <!-- 发布者信息 -->
        <div :class="$style.postHeader">
          <UserAvatar
            :avatar="item.avatar"
            :gender="item.gender"
            :size="36"
            :class="$style.avatar"
          />
          <div :class="$style.userInfo">
            <span :class="$style.nickname">{{ item.lawyerName || item.nickname }}</span>
            <span :class="$style.time">{{ item.createTime }}</span>
          </div>
        </div>

        <!-- 内容 -->
        <div :class="$style.postBody">
          <h3 :class="$style.postTitle">{{ item.title }}</h3>
          <p :class="$style.postContent">{{ item.content }}</p>
          <div v-if="item.images && item.images.length" :class="$style.images">
            <VanImage
              v-for="(img, idx) in item.images"
              :key="idx"
              fit="cover"
              width="80"
              height="80"
              :src="img"
              :class="$style.image"
            />
          </div>
        </div>

        <!-- 底部互动 -->
        <div :class="$style.postFooter" @click.stop>
          <span
            :class="[$style.action, { [$style.likedAction]: likedSet.has(item.id) }]"
            @click="onLikeClick(item)"
          >
            <VanIcon :name="likedSet.has(item.id) ? 'good-job' : 'good-job-o'" size="16" />
            {{ item.likeCount || 0 }}
          </span>
          <span :class="$style.action" @click="onPostClick(item.id)">
            <VanIcon name="comment-o" size="16" />
            {{ item.commentCount || 0 }}
          </span>
        </div>
      </div>
    </VanList>

    <VanEmpty
      v-if="!loading && finished && !posts.length"
      description="还没有人发布案例，快来发布第一个吧~"
      :class="$style.empty"
    />
  </section>
</template>

<script lang="ts" setup>
import { showToast } from 'vant';
import type { CommunityPost } from '@/types/community';
import { getPostList, likePost } from '@/services/community';
import { useUserStore } from '@/stores/modules/user';
import UserAvatar from '@/components/UserAvatar.vue';

const router = useRouter();
const userStore = useUserStore();
const posts = ref<CommunityPost[]>([]);
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const pageSize = 10;
const likedSet = reactive(new Set<string>());

const fetchPosts = async () => {
  loading.value = true;
  try {
    const result = await getPostList({ page: page.value, pageSize });
    // 同步点赞状态
    for (const item of result.items) {
      if (item.liked) {
        likedSet.add(item.id);
      }
    }
    posts.value = [...posts.value, ...result.items];
    finished.value = !result.hasMore;
    if (result.hasMore) {
      page.value += 1;
    }
  } catch {
    // 请求失败时标记结束，避免无限重试
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

const onLoad = () => {
  fetchPosts();
};

const onPublish = () => {
  if (!userStore.isLogin) {
    showToast('请先登录');
    router.push({ path: '/login', query: { redirect: '/community/publish' } });
    return;
  }
  router.push('/community/publish');
};

const onPostClick = (id: string) => {
  router.push('/community/' + id);
};

const onLikeClick = async (item: CommunityPost) => {
  if (!userStore.isLogin) {
    showToast('请先登录');
    router.push({ path: '/login', query: { redirect: '/community' } });
    return;
  }
  const id = Number(item.id);
  const wasLiked = likedSet.has(item.id);
  // 乐观更新
  if (wasLiked) {
    likedSet.delete(item.id);
    item.likeCount = Math.max(0, item.likeCount - 1);
  } else {
    likedSet.add(item.id);
    item.likeCount += 1;
  }
  try {
    const result = await likePost(id);
    // 以服务端返回为准
    if (result.liked) {
      likedSet.add(item.id);
    } else {
      likedSet.delete(item.id);
    }
    item.likeCount = result.likeCount;
  } catch {
    // 回滚
    if (wasLiked) {
      likedSet.add(item.id);
      item.likeCount += 1;
    } else {
      likedSet.delete(item.id);
      item.likeCount = Math.max(0, item.likeCount - 1);
    }
    showToast('操作失败，请稍后再试');
  }
};
</script>

<style lang="postcss" module>
.container {
  height: calc(100vh - 50px);
  background: #f7f8fa;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 5;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: var(--font-weight-semi-bold);
  color: #111;
}

.publishBtn {
  font-size: 13px;
  height: 32px;
  padding: 0 16px;
}

.card {
  margin: 10px 12px 0;
  padding: 14px;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

.postHeader {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  flex-shrink: 0;
  background: #f2f3f5;
}

.userInfo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nickname {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: #111;
}

.time {
  font-size: 11px;
  color: #999;
}

.reviewBadge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  line-height: 1.6;
  flex-shrink: 0;
  margin-left: auto;
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

.postBody {
  margin-top: 10px;
}

.postTitle {
  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-semi-bold);
  color: #222;
  line-height: 1.4;
}

.postContent {
  margin: 6px 0 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.images {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.image {
  border-radius: 6px;
  overflow: hidden;
  background: #f2f3f5;
}

.postFooter {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  user-select: none;

  &:active {
    opacity: 0.7;
  }
}

.likedAction {
  color: #1989fa;
}

.empty {
  margin-top: 120px;
}
</style>
