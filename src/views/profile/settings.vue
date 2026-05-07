<template>
  <section :class="$style.container">
    <VanCellGroup inset :class="$style.section">
      <VanCell title="修改密码" is-link @click="showPasswordDialog = true" />
    </VanCellGroup>

    <VanCellGroup inset :class="$style.section">
      <VanCell title="清理缓存" is-link @click="onClearCache" />
      <VanCell title="关于我们" is-link @click="goAbout" />
    </VanCellGroup>

    <!-- 修改密码弹窗 -->
    <VanDialog
      v-model:show="showPasswordDialog"
      title="修改密码"
      show-cancel-button
      :before-close="onChangePassword"
    >
      <div :class="$style.formBody">
        <VanField
          v-model="oldPassword"
          type="password"
          label="原密码"
          placeholder="请输入原密码"
        />
        <VanField
          v-model="newPassword"
          type="password"
          label="新密码"
          placeholder="请输入新密码（至少6位）"
        />
      </div>
    </VanDialog>
  </section>
</template>

<script lang="ts" setup>
import { showToast } from 'vant';
import * as userService from '@/services/user';

const router = useRouter();

const showPasswordDialog = ref(false);
const oldPassword = ref('');
const newPassword = ref('');

const onChangePassword = async (action: string) => {
  if (action === 'cancel') {
    oldPassword.value = '';
    newPassword.value = '';
    return true;
  }

  if (!oldPassword.value || !newPassword.value) {
    showToast('请填写完整密码信息');
    return false;
  }

  if (newPassword.value.length < 6) {
    showToast('新密码至少6位');
    return false;
  }

  try {
    await userService.changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    showToast({ message: '密码修改成功', icon: 'success' });
    oldPassword.value = '';
    newPassword.value = '';
    return true;
  } catch {
    showToast('密码修改失败，请检查原密码是否正确');
    return false;
  }
};

const onClearCache = () => {
  showToast({ message: '缓存已清理', icon: 'success' });
};

const goAbout = () => {
  router.push('/profile/about');
};
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  background: #f7f8fa;
  padding-bottom: env(safe-area-inset-bottom);
}

.section {
  margin-top: 12px;
}

.formBody {
  padding: 12px 0;
}
</style>
