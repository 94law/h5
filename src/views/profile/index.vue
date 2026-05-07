<template>
  <section :class="$style.container">
    <!-- 未登录状态 -->
    <template v-if="!userStore.isLogin">
      <div :class="$style.loginBanner">
        <div :class="$style.avatarPlaceholder">
          <VanIcon name="user-o" size="40" color="#ccc" />
        </div>
        <p :class="$style.loginHint">登录后查看更多精彩内容</p>
        <VanButton type="primary" round size="small" :class="$style.loginBtn" @click="goLogin">
          立即登录
        </VanButton>
      </div>

      <VanCellGroup inset :class="$style.section">
        <VanCell title="我的收藏" icon="star-o" is-link @click="goLogin" />
        <VanCell title="浏览记录" icon="clock-o" is-link @click="goLogin" />
        <VanCell title="关于我们" icon="info-o" is-link @click="goPage('about')" />
      </VanCellGroup>
    </template>

    <!-- 已登录状态 -->
    <template v-else>
      <div :class="$style.profileHeader" @click="goPage('edit')">
        <UserAvatar
          :avatar="userStore.profile.avatar"
          :gender="userStore.profile.gender"
          :size="64"
        />
        <div :class="$style.profileInfo">
          <p :class="$style.nickname">{{ displayName }}</p>
        </div>
        <VanIcon name="arrow" size="16" color="#c8c9cc" />
      </div>

      <VanCellGroup inset :class="$style.section">
        <VanCell title="我的发布" icon="records-o" is-link @click="goPage('posts')" />
        <VanCell title="我的收藏" icon="star-o" is-link @click="goPage('favorites')" />
      </VanCellGroup>

      <VanCellGroup inset :class="$style.section">
        <VanCell title="设置" icon="setting-o" is-link @click="goPage('settings')" />
        <VanCell title="关于我们" icon="info-o" is-link @click="goPage('about')" />
      </VanCellGroup>

      <div :class="$style.logoutWrap">
        <VanButton type="default" round block :class="$style.logoutBtn" @click="onLogout">
          退出登录
        </VanButton>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user';
import UserAvatar from '@/components/UserAvatar.vue';

const router = useRouter();
const userStore = useUserStore();

// 仅在已登录时获取用户信息，避免未登录触发 401 Toast
if (userStore.isLogin) {
  userStore.fetchProfile();
}

const displayName = computed(() => {
  const p = userStore.profile;
  return p.nickname || p.username || '未设置昵称';
});

const goLogin = () => {
  router.push({ path: '/login', query: { redirect: '/profile' } });
};

const goPage = (page: string) => {
  router.push(`/profile/${page}`);
};

const onLogout = async () => {
  await userStore.logout();
  router.replace('/profile');
};
</script>

<style lang="postcss" module>
.container {
  height: calc(100vh - 50px);
  background: #f7f8fa;
}

.loginBanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 24px;
  background: #fff;
  margin-bottom: 12px;
}

.avatarPlaceholder {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loginHint {
  margin: 12px 0 16px;
  font-size: 14px;
  color: #999;
}

.loginBtn {
  width: 140px;
  height: 36px;
  font-size: 14px;
}

.profileHeader {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 16px;
  background: #fff;
  margin-bottom: 12px;
  cursor: pointer;
}

.profileInfo {
  flex: 1;
}

.nickname {
  margin: 0;
  font-size: 20px;
  font-weight: var(--font-weight-semi-bold);
  color: #111;
}

.section {
  margin-top: 12px;
}

.logoutWrap {
  padding: 24px 12px 40px;
}

.logoutBtn {
  color: #999;
  border-color: #e5e5e5;
}
</style>
