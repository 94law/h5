<template>
  <div :class="$style.container">
    <VanNavBar :title="isRegister ? '注册' : '登录'" left-text="返回" left-arrow @click-left="router.back" />
    <div :class="$style.body">
        <div :class="$style.content">
          <h1>{{ isRegister ? '注册账号' : '欢迎登录' }}</h1>
          <VanForm @submit="onSubmit">
            <VanCellGroup inset>
              <VanField
                v-model="form.phone"
                label="手机号"
                :maxlength="11"
                label-width="3.3em"
                placeholder="请输入手机号"
                :rules="[{ required: true, message: '请填写手机号' }]"
              />
              <VanField
                v-if="isRegister"
                v-model="form.nickname"
                label="昵称"
                label-width="3.3em"
                placeholder="请输入昵称"
                :rules="[{ required: true, message: '请填写昵称' }]"
              />
              <VanField
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="密码"
                :maxlength="20"
                label-width="3.3em"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请填写密码' }]"
              >
                <template #right-icon>
                  <VanIcon
                    :name="showPassword ? 'eye-o' : 'closed-eye'"
                    size="20"
                    :class="$style.eyeIcon"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </VanField>
            </VanCellGroup>
            <VanButton
              type="primary"
              native-type="submit"
              block
              :loading="submitting"
              :class="$style.loginButton"
            >
              {{ isRegister ? '注册' : '登录' }}
            </VanButton>
          </VanForm>
          <div :class="$style.toggle">
            <span v-if="!isRegister">
              还没有账号？<a href="javascript:;" @click="switchMode">立即注册</a>
            </span>
            <span v-else>
              已有账号？<a href="javascript:;" @click="switchMode">去登录</a>
            </span>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isPhoneNumber } from '@/shared/validators';
import { useUserStore } from '@/stores/modules/user';
import { showToast } from 'vant';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isRegister = ref(false);
const showPassword = ref(false);
const submitting = ref(false);

const form = reactive({
  phone: '',
  nickname: '',
  password: '',
});

const switchMode = () => {
  isRegister.value = !isRegister.value;
  showPassword.value = false;
};

const onSubmit = async () => {
  if (!form.phone.length || !isPhoneNumber(form.phone)) {
    showToast({ message: '请输入正确手机号', position: 'bottom' });
    return;
  }

  if (form.password.length < 6) {
    showToast({ message: '密码至少6位', position: 'bottom' });
    return;
  }

  if (isRegister.value && !form.nickname.trim()) {
    showToast({ message: '请填写昵称', position: 'bottom' });
    return;
  }

  submitting.value = true;

  try {
    if (isRegister.value) {
      await userStore.register({
        phone: form.phone,
        nickname: form.nickname.trim(),
        password: form.password,
      });
    } else {
      await userStore.login({
        account: form.phone,
        password: form.password,
      });
    }

    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch {
    // 错误已在 axios 拦截器中通过 toast 提示
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  display: flex;
  flex-direction: column;
}

.body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  margin: 0 25px;
  background: #efefef;
  padding: 15px;
  border-radius: 10px;

  & > h1 {
    font-size: 24px;
    font-weight: var(--font-weight-medium);
    text-align: center;
    margin-block-end: 10px;
  }
}

.loginButton {
  margin-block-start: 20px;
}

.eyeIcon {
  cursor: pointer;
  color: #999;
}

.toggle {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: #999;

  & a {
    color: var(--primary-color);
    text-decoration: none;
  }
}
</style>
