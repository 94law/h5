<template>
  <section :class="$style.container">
    <VanLoading v-if="loading" vertical :class="$style.loading">加载中...</VanLoading>

    <VanEmpty v-else-if="!post" description="案例不存在或已删除" :class="$style.empty">
      <VanButton size="small" type="primary" @click="router.back()">返回</VanButton>
    </VanEmpty>

    <template v-else>
      <!-- 发布者信息 -->
      <div :class="$style.authorCard">
        <UserAvatar :avatar="post.avatar" :gender="post.gender" :size="48" :class="$style.avatar" />
        <div :class="$style.authorInfo">
          <span :class="$style.nickname">{{ post.lawyerName || post.nickname }}</span>
          <div :class="$style.authorMeta">
            <span :class="$style.time">{{ post.createTime }}</span>
            <span
              v-if="post.reviewStatus"
              :class="[$style.reviewBadge, $style['reviewBadge--' + post.reviewStatus]]"
            >
              {{
                post.reviewStatus === 'pending'
                  ? '审核中'
                  : post.reviewStatus === 'approved'
                    ? '已通过'
                    : '未通过'
              }}
            </span>
          </div>
        </div>
      </div>

      <!-- 文章内容 -->
      <article :class="$style.article">
        <h1 :class="$style.title">{{ post.title }}</h1>
        <div :class="$style.content" v-html="formatContent(post.content)"></div>

        <!-- 配图 -->
        <div v-if="post.images && post.images.length" :class="$style.imagesWrap">
          <VanImage
            v-for="(img, idx) in post.images"
            :key="idx"
            fit="contain"
            width="100%"
            :src="img"
            :class="$style.detailImage"
            @click="onPreviewImage(img)"
          />
        </div>
      </article>

      <!-- 评论区 -->
      <div ref="commentSectionRef" :class="$style.commentSection">
        <div :class="$style.commentHeader">评论（{{ post.commentCount }}）</div>

        <!-- 评论列表 -->
        <VanList
          v-model:loading="commentLoading"
          :finished="commentFinished"
          finished-text="没有更多评论了"
          @load="onLoadComments"
        >
          <div v-for="item in comments" :key="item.id" :class="$style.commentItem">
            <UserAvatar
              :avatar="item.avatar"
              :gender="item.gender"
              :size="28"
              :class="$style.commentAvatar"
            />
            <div :class="$style.commentBody">
              <div :class="$style.commentHead">
                <span :class="$style.commentNickname">{{ item.nickname }}</span>
                <span :class="$style.commentTime">{{ item.createTime }}</span>
              </div>
              <div :class="$style.commentContent">{{ item.content }}</div>
            </div>
          </div>
        </VanList>

        <VanEmpty
          v-if="!commentLoading && commentFinished && !comments.length"
          description="暂无评论，快来发表第一条评论吧"
          :class="$style.commentEmpty"
        />

        <!-- 评论输入区 -->
        <div :class="$style.commentInputWrap">
          <div :class="$style.commentInputBox">
            <input
              v-model="commentText"
              :class="$style.commentInput"
              type="text"
              placeholder="写评论..."
              maxlength="500"
              @focus="onInputFocus"
            />
            <VanButton
              type="primary"
              size="small"
              round
              :disabled="!commentText.trim()"
              :loading="commentSubmitting"
              @click="onSubmitComment"
            >
              发送
            </VanButton>
          </div>
        </div>
      </div>
    </template>

    <!-- 底部互动栏 -->
    <div v-if="post" :class="$style.actionBar">
      <div :class="$style.actionItem" @click="onLike">
        <VanIcon
          :name="liked ? 'good-job' : 'good-job-o'"
          size="22"
          :color="liked ? '#1989fa' : '#666'"
        />
        <span :class="[$style.actionText, { [$style.likedText]: liked }]">
          {{ post.likeCount }}
        </span>
      </div>
      <div :class="$style.actionItem" @click="onScrollToComments">
        <VanIcon name="comment-o" size="22" color="#666" />
        <span :class="$style.actionText">{{ post.commentCount }}</span>
      </div>
      <div :class="$style.actionItem" @click="onFavorite">
        <VanIcon
          :name="favorited ? 'star' : 'star-o'"
          size="22"
          :color="favorited ? '#ffa41c' : '#666'"
        />
        <span :class="[$style.actionText, { [$style.favoritedText]: favorited }]">收藏</span>
      </div>
      <div :class="$style.actionItem">
        <VanIcon name="share-o" size="22" color="#666" />
        <span :class="$style.actionText">分享</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { showToast } from 'vant';
import { getPostDetail, likePost } from '@/services/community';
import { getComments, createComment } from '@/services/comment';
import { addFavorite, removeFavorite, checkFavorited } from '@/services/favorite';
import type { CommunityPost, CommentItem } from '@/types/community';
import { useUserStore } from '@/stores/modules/user';
import UserAvatar from '@/components/UserAvatar.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const post = ref<CommunityPost | undefined>(undefined);
const loading = ref(true);
const liked = ref(false);
const favorited = ref(false);

// 评论相关
const commentSectionRef = ref<HTMLElement>();
const comments = ref<CommentItem[]>([]);
const commentLoading = ref(false);
const commentFinished = ref(false);
const commentPage = ref(1);
const commentPageSize = 20;
const commentText = ref('');
const commentSubmitting = ref(false);

const fetchDetail = async () => {
  loading.value = true;
  try {
    const id = Number(route.params.id ?? 0);
    const isMine = route.query.mine === '1';
    post.value = await getPostDetail(id, isMine);
    liked.value = post.value.liked;
    // 如果已登录，检查收藏状态
    if (userStore.isLogin) {
      checkFavorited(id)
        .then((result) => {
          favorited.value = result;
        })
        .catch(() => {});
    }
  } catch {
    post.value = undefined;
  } finally {
    loading.value = false;
  }
};

const formatContent = (content: string) => {
  return content.replace(/\n/g, '<br/>').replace(/(\d+[.、)）].*?)(?=<br\/>|$)/g, '<p>$1</p>');
};

const onLike = async () => {
  if (!post.value) return;
  if (!userStore.isLogin) {
    showToast('请先登录');
    router.push({ path: '/login', query: { redirect: `/community/${post.value.id}` } });
    return;
  }
  const id = Number(post.value.id);
  try {
    const result = await likePost(id);
    liked.value = result.liked;
    post.value.likeCount = result.likeCount;
    if (result.liked) {
      showToast({ message: '已点赞', icon: 'good-job', position: 'bottom' });
    }
  } catch {
    showToast('操作失败，请稍后再试');
  }
};

const onFavorite = async () => {
  if (!post.value) return;
  if (!userStore.isLogin) {
    showToast('请先登录');
    router.push({ path: '/login', query: { redirect: `/community/${post.value.id}` } });
    return;
  }
  const id = Number(post.value.id);
  try {
    if (favorited.value) {
      await removeFavorite(id);
      favorited.value = false;
      showToast({ message: '已取消收藏', icon: 'success', position: 'bottom' });
    } else {
      await addFavorite(id);
      favorited.value = true;
      showToast({ message: '已收藏', icon: 'star', position: 'bottom' });
    }
  } catch {
    showToast('操作失败，请稍后再试');
  }
};

const onScrollToComments = () => {
  commentSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const fetchComments = async () => {
  if (!post.value) return;
  commentLoading.value = true;
  try {
    const result = await getComments({
      postId: Number(post.value.id),
      page: commentPage.value,
      pageSize: commentPageSize,
    });
    comments.value = [...comments.value, ...result.items];
    commentFinished.value = !result.hasMore;
    if (result.hasMore) {
      commentPage.value += 1;
    }
  } catch {
    commentFinished.value = true;
  } finally {
    commentLoading.value = false;
  }
};

const onLoadComments = () => {
  fetchComments();
};

const onInputFocus = () => {
  if (!userStore.isLogin) {
    showToast('请先登录');
    router.push({ path: '/login', query: { redirect: `/community/${post.value?.id ?? ''}` } });
    return;
  }
};

const onSubmitComment = async () => {
  if (!post.value) return;
  if (!userStore.isLogin) {
    showToast('请先登录');
    router.push({ path: '/login', query: { redirect: `/community/${post.value.id}` } });
    return;
  }
  const text = commentText.value.trim();
  if (!text) return;
  commentSubmitting.value = true;
  try {
    const newComment = await createComment({
      postId: Number(post.value.id),
      content: text,
    });
    comments.value = [newComment, ...comments.value];
    post.value.commentCount += 1;
    commentText.value = '';
    showToast({ message: '评论成功', icon: 'success' });
  } catch {
    showToast('评论失败，请稍后再试');
  } finally {
    commentSubmitting.value = false;
  }
};

const onPreviewImage = (img: string) => {
  showToast('图片预览功能开发中');
};

onMounted(() => {
  fetchDetail();
});
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  background: #f7f8fa;
  padding-bottom: 80px;
}

.loading {
  padding-top: 120px;
}

.empty {
  margin-top: 120px;
}

.authorCard {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  margin-bottom: 8px;
}

.avatar {
  flex-shrink: 0;
  background: #f5f5f5;
}

.authorInfo {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nickname {
  font-size: 15px;
  font-weight: var(--font-weight-semi-bold);
  color: #111;
}

.time {
  font-size: 12px;
  color: #999;
}

.authorMeta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviewBadge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  line-height: 1.6;
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

.article {
  padding: 16px;
  background: #fff;
}

.title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: #111;
  line-height: 1.5;
}

.content {
  font-size: 15px;
  color: #333;
  line-height: 1.8;
  word-break: break-word;

  :global {
    p {
      margin: 8px 0;
    }
  }
}

.imagesWrap {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detailImage {
  border-radius: 6px;
  overflow: hidden;
  background: #f2f3f5;
}

.actionBar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -1px 6px rgb(0 0 0 / 6%);
  z-index: 10;
}

.actionItem {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.7;
  }
}

.actionText {
  font-size: 14px;
  color: #666;
}

.likedText {
  color: #1989fa;
}

.favoritedText {
  color: #ffa41c;
}

/* 评论区样式 */
.commentSection {
  margin-top: 8px;
  padding: 0 16px;
  background: #fff;
}

.commentHeader {
  padding: 14px 0 10px;
  font-size: 15px;
  font-weight: var(--font-weight-semi-bold);
  color: #111;
  border-bottom: 1px solid #f0f0f0;
}

.commentItem {
  display: flex;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px solid #f7f7f7;
}

.commentAvatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.commentBody {
  flex: 1;
  min-width: 0;
}

.commentHead {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.commentNickname {
  font-size: 13px;
  font-weight: var(--font-weight-medium);
  color: #333;
}

.commentTime {
  font-size: 11px;
  color: #bbb;
}

.commentContent {
  font-size: 14px;
  color: #444;
  line-height: 1.6;
  word-break: break-word;
}

.commentEmpty {
  padding: 32px 0;
}

.commentInputWrap {
  padding: 12px 0 calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #f0f0f0;
  position: sticky;
  bottom: 52px;
}

.commentInputBox {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 4px;
}

.commentInput {
  flex: 1;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #e5e5e5;
  border-radius: 18px;
  font-size: 14px;
  color: #333;
  background: #f7f8fa;
  outline: none;

  &::placeholder {
    color: #ccc;
  }
}
</style>
