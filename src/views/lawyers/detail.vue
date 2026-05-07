<template>
  <section :class="$style.container">
    <!-- 错误 -->
    <VanEmpty v-if="hasError" description="详情加载失败" :class="$style.status">
      <VanButton size="small" type="primary" @click="fetchDetail">点击重试</VanButton>
    </VanEmpty>

    <template v-else-if="detail">
      <!-- 个人资料头部 -->
      <div :class="$style.profileBanner">
        <div :class="$style.bannerInner">
          <div :class="$style.avatarBox">
            <VanImage
              round
              fit="cover"
              width="72"
              height="72"
              :src="avatarUrl"
              :class="$style.avatar"
            />
            <span
              v-if="detail.gender !== null"
              :class="[$style.genderBadge, detail.gender === 0 ? $style.female : $style.male]"
            >
              {{ detail.gender === 0 ? '♀' : '♂' }}
            </span>
          </div>
          <h2 :class="$style.name">{{ detail.name }}</h2>
          <p :class="$style.titleLine">{{ detail.title }} · {{ detail.lawFirm }}</p>
          <div :class="$style.metaLine">
            <span>
              <VanIcon name="location-o" size="13" />
              {{ detail.city }}
            </span>
            <span>
              <VanIcon name="clock-o" size="13" />
              {{ detail.yearsOfPractice }}年执业
            </span>
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div :class="$style.statCards">
        <div :class="$style.statCard">
          <div :class="$style.statIcon" style="background: #fff7e6">
            <VanIcon name="star-o" size="18" color="#ffa41c" />
          </div>
          <div :class="$style.statInfo">
            <span :class="$style.statVal">{{ detail.rating || '-' }}</span>
            <span :class="$style.statDesc">评分</span>
          </div>
        </div>
        <div :class="$style.statCard">
          <div :class="$style.statIcon" style="background: #e8f4ff">
            <VanIcon name="chat-o" size="18" color="#1989fa" />
          </div>
          <div :class="$style.statInfo">
            <span :class="$style.statVal">{{ detail.consultationCount || 0 }}</span>
            <span :class="$style.statDesc">咨询次数</span>
          </div>
        </div>
        <div :class="$style.statCard">
          <div :class="$style.statIcon" style="background: #ffeded">
            <VanIcon name="label-o" size="18" color="#ee0a24" />
          </div>
          <div :class="$style.statInfo">
            <span :class="$style.priceVal">{{ detail.priceText || '面议' }}</span>
            <span :class="$style.statDesc">咨询价格</span>
          </div>
        </div>
      </div>

      <!-- 擅长领域 -->
      <div :class="$style.sectionWrap">
        <div :class="$style.sectionTitle">
          <VanIcon name="flag-o" size="16" color="#1989fa" />
          <span>擅长领域</span>
        </div>
        <div :class="$style.tagWrap">
          <VanTag
            v-for="item in parseTextTags(detail.expertise)"
            :key="item"
            plain
            type="primary"
            :class="$style.tag"
          >
            {{ item }}
          </VanTag>
        </div>
      </div>

      <!-- 基本信息 -->
      <div :class="$style.sectionWrap">
        <div :class="$style.sectionTitle">
          <VanIcon name="user-circle-o" size="16" color="#1989fa" />
          <span>基本信息</span>
        </div>
        <VanCellGroup inset :class="$style.cellGroup">
          <VanCell title="律师简介" :label="detail.bio || '暂无简介'" />
          <VanCell title="教育背景" :label="detail.education || '暂无'" />
          <VanCell title="服务语言" :label="detail.languages || '暂无'" />
          <VanCell title="服务时间" :label="detail.serviceTime || '暂无'" />
          <VanCell title="成功案例" :label="detail.successCases || '暂无'" />
          <VanCell title="荣誉信息" :label="detail.honors || '暂无'" />
        </VanCellGroup>
      </div>

      <!-- 联系方式 -->
      <div :class="$style.sectionWrap">
        <div :class="$style.sectionTitle">
          <VanIcon name="phone-circle-o" size="16" color="#07c160" />
          <span>联系方式</span>
        </div>
        <VanCellGroup inset :class="$style.cellGroup">
          <VanCell title="联系电话" :value="detail.contactPhone || '暂无'" />
          <VanCell title="微信" :value="detail.contactWechat || '暂无'" />
          <VanCell title="邮箱" :value="detail.contactEmail || '暂无'" />
        </VanCellGroup>
      </div>
    </template>

    <VanLoading v-else vertical :class="$style.loading">加载中...</VanLoading>

    <!-- 底部操作栏 -->
    <footer :class="$style.footer">
      <VanButton type="primary" block round @click="handleConsultAction">
        <VanIcon name="phone-circle-o" size="18" />
        立即咨询
      </VanButton>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { showToast } from 'vant';
import { getLawyerDetail } from '@/services/lawyer';
import type { LawyerDetail } from '@/types/lawyer';
import { getLawyerDefaultAvatar } from '@/shared/avatar';

const route = useRoute();

const detail = ref<LawyerDetail | null>(null);
const hasError = ref(false);

const avatarUrl = computed(() => {
  if (!detail.value) return '';
  return detail.value.avatarUrl || getLawyerDefaultAvatar(detail.value.name);
});

const fetchDetail = async () => {
  const id = String(route.params.id ?? '');
  if (!id) {
    hasError.value = true;
    return;
  }

  hasError.value = false;

  try {
    detail.value = await getLawyerDetail(id);
  } catch {
    hasError.value = true;
    showToast('律师详情加载失败');
  }
};

const handleConsultAction = () => {
  if (!detail.value) {
    return;
  }

  if (detail.value.contactPhone) {
    window.location.href = `tel:${detail.value.contactPhone}`;
    return;
  }

  if (detail.value.contactWechat) {
    showToast(`请添加微信咨询：${detail.value.contactWechat}`);
    return;
  }

  showToast('咨询方式暂未提供');
};

const parseTextTags = (value: string) => {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

onMounted(() => {
  fetchDetail();
});
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  padding-bottom: 90px;
  background: #f5f6f8;
}

.status {
  margin-top: 120px;
}

.loading {
  margin-top: 120px;
}

/* 头部背景卡片 */
.profileBanner {
  margin: 0 12px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 50%, #3a8ec7 100%);
  overflow: hidden;
}

.bannerInner {
  padding: 24px 20px 20px;
  text-align: center;
}

.avatarBox {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
}

.avatar {
  display: block;
  border: 3px solid rgb(255 255 255 / 40%);
  box-shadow: 0 4px 16px rgb(0 0 0 / 20%);
  background: #f2f3f5;
}

.genderBadge {
  position: absolute;
  right: -2px;
  bottom: 0;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  border-radius: 50%;
  color: #fff;
  border: 2px solid #fff;
}

.male {
  background: #4d8cf5;
}

.female {
  background: #f5708f;
}

.name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.titleLine {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgb(255 255 255 / 80%);
}

.metaLine {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 8px;
  font-size: 12px;
  color: rgb(255 255 255 / 65%);
}

.metaLine span {
  display: flex;
  align-items: center;
  gap: 3px;
}

/* 统计卡片 */
.statCards {
  display: flex;
  gap: 8px;
  margin: -8px 12px 0;
  position: relative;
  z-index: 1;
}

.statCard {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 10px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
}

.statIcon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.statInfo {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.statVal {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.statDesc {
  font-size: 11px;
  color: #999;
  margin-top: 1px;
}

.priceVal {
  font-size: 14px;
  font-weight: 700;
  color: #ee0a24;
}

/* 分区 */
.sectionWrap {
  margin: 14px 12px 0;
}

.sectionTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.cellGroup {
  border-radius: 10px;
  overflow: hidden;
  margin: 0;
}

/* 标签 */
.tagWrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  background: #fff;
}

.tag {
  margin-right: 0;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 4px;
  color: #1989fa;
  border-color: #d9e8ff;
  background: #f0f7ff;
}

/* 底部 */
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2px 12px rgb(0 0 0 / 5%);
  z-index: 10;
}

.footer :global(.van-button__content) {
  gap: 6px;
}
</style>
