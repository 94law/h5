<template>
  <section :class="$style.container">
    <VanForm @submit="onSubmit">
      <VanCellGroup inset :class="$style.formGroup">
        <VanField
          v-model="title"
          name="title"
          label="标题"
          placeholder="请输入案例标题（最多128字）"
          :rules="[{ required: true, message: '请输入标题' }]"
          maxlength="128"
          :show-word-limit="true"
        />
        <VanField
          v-model="lawyerName"
          name="lawyerName"
          label="律师"
          placeholder="请输入律师姓名"
          maxlength="32"
        />
        <VanField
          v-model="content"
          name="content"
          label="内容"
          type="textarea"
          rows="8"
          autosize
          placeholder="请分享您的案例详情..."
          :rules="[{ required: true, message: '请输入内容' }]"
          :class="$style.textarea"
        />
      </VanCellGroup>

      <!-- 图片上传区 -->
      <div :class="$style.imageSection">
        <p :class="$style.imageTitle">配图（可选，最多9张）</p>
        <div :class="$style.imageGrid">
          <!-- 已上传的图片 -->
          <div
            v-for="(img, idx) in images"
            :key="idx"
            :class="$style.imageItem"
          >
            <VanImage
              fit="cover"
              width="100%"
              height="100%"
              :src="img"
              :class="$style.imagePreview"
              @click="onPreviewImage(img)"
            />
            <div :class="$style.imageDelete" @click.stop="onRemoveImage(idx)">
              <VanIcon name="cross" size="14" color="#fff" />
            </div>
          </div>

          <!-- 上传按钮 -->
          <label
            v-if="images.length < 9"
            :class="$style.uploadBtn"
          >
            <VanIcon name="plus" size="28" color="#c8c9cc" />
            <input
              type="file"
              accept="image/*"
              :class="$style.fileInput"
              @change="onFileChange"
            />
          </label>
        </div>
      </div>

      <div :class="$style.submitWrap">
        <VanButton
          type="primary"
          round
          block
          native-type="submit"
          :loading="submitting"
          :disabled="submitting"
        >
          发布
        </VanButton>
      </div>
    </VanForm>
  </section>
</template>

<script lang="ts" setup>
import { showToast } from 'vant';
import { createPost } from '@/services/community';
import { uploadFile } from '@/services/user';
import { useUserStore } from '@/stores/modules/user';

const router = useRouter();
const userStore = useUserStore();
const title = ref('');
const lawyerName = ref('');
const content = ref('');
const images = ref<string[]>([]);
const submitting = ref(false);

// 进入页面前检查登录状态
if (!userStore.isLogin) {
  router.replace({
    path: '/login',
    query: { redirect: '/community/publish' },
  });
}

const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 文件大小校验（最大5MB）
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过5MB');
    input.value = '';
    return;
  }

  try {
    showToast({ message: '上传中...', icon: 'loading', duration: 0 });
    const result = await uploadFile(file);
    images.value = [...images.value, result.url];
    showToast({ message: '上传成功', icon: 'success' });
  } catch {
    showToast('上传失败，请稍后重试');
  } finally {
    input.value = '';
  }
};

const onRemoveImage = (idx: number) => {
  images.value = images.value.filter((_, i) => i !== idx);
};

const onPreviewImage = (img: string) => {
  // 可后续扩展为图片预览
};

const onSubmit = async () => {
  if (!title.value.trim() || !content.value.trim()) return;
  submitting.value = true;
  try {
    await createPost({
      title: title.value.trim(),
      content: content.value.trim(),
      images: images.value.length > 0 ? images.value : undefined,
      lawyerName: lawyerName.value.trim() || undefined,
    });
    showToast({ message: '提交成功，请等待审核', icon: 'success' });
    // 返回上一页（圈子列表），并触发刷新
    router.back();
  } catch {
    showToast('发布失败，请稍后再试');
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  background: #f7f8fa;
  padding-bottom: env(safe-area-inset-bottom);
}

.formGroup {
  margin-top: 12px;
}

.textarea {
  :global {
    .van-field__control {
      min-height: 200px;
    }
  }
}

.imageSection {
  margin-top: 12px;
  padding: 14px 16px;
  background: #fff;
}

.imageTitle {
  margin: 0 0 12px;
  font-size: 14px;
  color: #999;
}

.imageGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.imageItem {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: #f2f3f5;
}

.imagePreview {
  display: block;
}

.imageDelete {
  position: absolute;
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background: rgb(0 0 0 / 45%);
  border-radius: 0 6px 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;

  &:active {
    background: rgb(0 0 0 / 65%);
  }
}

.uploadBtn {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  background: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  &:active {
    background: #ebedf0;
  }
}

.fileInput {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.submitWrap {
  padding: 24px 16px;
}
</style>
