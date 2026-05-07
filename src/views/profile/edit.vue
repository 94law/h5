<template>
  <section :class="$style.container">
    <!-- 头像编辑 -->
    <div :class="$style.avatarSection">
      <p :class="$style.sectionTitle">头像</p>
      <label :class="$style.avatarWrap">
        <UserAvatar :avatar="currentAvatar" :gender="editingGender ?? undefined" :size="80" />
        <input type="file" accept="image/*" :class="$style.fileInput" @change="onAvatarChange" />
        <VanIcon name="photograph" :class="$style.cameraIcon" size="18" color="#fff" />
      </label>
      <p :class="$style.avatarHint">点击更换头像</p>
    </div>

    <!-- 昵称 -->
    <VanCellGroup inset :class="$style.section">
      <VanField v-model="editingNickname" label="昵称" placeholder="请输入昵称" maxlength="64" />
    </VanCellGroup>

    <!-- 邮箱 -->
    <VanCellGroup inset :class="$style.section">
      <VanField
        v-model="editingEmail"
        label="邮箱"
        type="email"
        placeholder="请输入邮箱"
        maxlength="64"
        :rules="emailRules"
      />
    </VanCellGroup>

    <!-- 性别 -->
    <VanCellGroup inset :class="$style.section">
      <VanCell title="性别" :value="genderLabel" is-link @click="showGenderPicker = true" />
    </VanCellGroup>

    <!-- 保存按钮 -->
    <div :class="$style.saveWrap">
      <VanButton
        type="primary"
        round
        block
        :loading="saving"
        :disabled="saving"
        @click="onSaveProfile"
      >
        保存
      </VanButton>
    </div>

    <!-- 性别选择弹出层 -->
    <VanPopup v-model:show="showGenderPicker" position="bottom" round>
      <VanPicker
        :columns="genderOptions"
        :default-index="editingGender ?? 2"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </VanPopup>
  </section>
</template>

<script lang="ts" setup>
import { showToast } from 'vant';
import { useUserStore } from '@/stores/modules/user';
import * as userService from '@/services/user';
import UserAvatar from '@/components/UserAvatar.vue';

const router = useRouter();
const userStore = useUserStore();

// 初始化编辑数据
const init = async () => {
  await userStore.fetchProfile();
  const p = userStore.profile;
  editingNickname.value = p.nickname || p.username || '';
  editingEmail.value = p.email || '';
  editingGender.value = p.gender ?? 2;
  currentAvatar.value = p.avatar ?? '';
};
init();

const editingNickname = ref('');
const editingEmail = ref('');
const editingGender = ref<number>(2);
const currentAvatar = ref('');
const saving = ref(false);
const showGenderPicker = ref(false);

const genderOptions = [
  { text: '女', value: 0 },
  { text: '男', value: 1 },
  { text: '保密', value: 2 },
];

const genderLabel = computed(() => {
  const opt = genderOptions.find((g) => g.value === editingGender.value);
  return opt?.text ?? '保密';
});

const emailRules = [
  {
    validator: (value: string) => {
      if (!value) return true; // 允许为空
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    },
    message: '请输入正确的邮箱格式',
  },
];

const onAvatarChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    showToast({ message: '上传中...', icon: 'loading', duration: 0 });
    const result = await userService.uploadFile(file);
    currentAvatar.value = result.url;
    showToast({ message: '头像上传成功', icon: 'success' });
  } catch {
    showToast('上传失败，请稍后重试');
  } finally {
    input.value = '';
  }
};

const onGenderConfirm = ({ selectedOptions }: any) => {
  editingGender.value = selectedOptions[0]?.value ?? 2;
  showGenderPicker.value = false;
};

const onSaveProfile = async () => {
  saving.value = true;
  try {
    const payload: any = {};
    const p = userStore.profile;
    if (editingNickname.value && editingNickname.value !== (p.nickname || p.username || '')) {
      payload.nickname = editingNickname.value;
    }
    if (editingEmail.value !== (p.email || '')) {
      // 空字符串传 null，避免后端 @IsEmail() 校验失败
      payload.email = editingEmail.value || null;
    }
    if (editingGender.value !== (p.gender ?? 2)) {
      payload.gender = editingGender.value;
    }
    if (currentAvatar.value !== (p.avatar ?? '')) {
      payload.avatar = currentAvatar.value;
    }
    if (Object.keys(payload).length === 0) {
      showToast('没有需要保存的更改');
      saving.value = false;
      return;
    }
    // 保存前校验邮箱格式
    if (payload.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(payload.email)) {
      showToast('请输入正确的邮箱格式');
      saving.value = false;
      return;
    }
    const updated = await userService.updateProfile(payload);
    userStore.updateProfile(updated);
    showToast({ message: '保存成功', icon: 'success' });
    router.back();
  } catch {
    showToast('保存失败，请稍后重试');
  } finally {
    saving.value = false;
  }
};
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  background: #f7f8fa;
  padding-bottom: env(safe-area-inset-bottom);
}

.avatarSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 0 24px;
  background: #fff;
  margin-bottom: 12px;
}

.sectionTitle {
  margin: 0 0 16px;
  font-size: 14px;
  color: #999;
  align-self: flex-start;
  padding-left: 16px;
}

.avatarWrap {
  position: relative;
  cursor: pointer;
}

.fileInput {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.cameraIcon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 26px;
  height: 26px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  pointer-events: none;
}

.avatarHint {
  margin: 10px 0 0;
  font-size: 13px;
  color: #999;
}

.section {
  margin-top: 12px;
}

.saveWrap {
  padding: 24px 16px 0;
}
</style>
