<template>
  <section :class="$style.container">
    <!-- 搜索栏 -->
    <div :class="$style.header">
      <VanSearch
        v-model="keyword"
        shape="round"
        placeholder="搜索律师姓名/律所/擅长领域"
        @search="onSearch"
        @clear="onSearch"
      />
    </div>

    <!-- 错误状态 -->
    <VanEmpty v-if="hasError" description="加载失败，请稍后重试" :class="$style.status">
      <VanButton type="primary" size="small" @click="onRetry">重新加载</VanButton>
    </VanEmpty>

    <!-- 列表 -->
    <template v-else>
      <VanList
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多律师了"
        @load="onLoad"
      >
        <div v-for="item in lawyers" :key="item.id" :class="$style.card" @click="goDetail(item.id)">
          <!-- 卡片头部：头像+基本信息 -->
          <div :class="$style.cardHead">
            <div :class="$style.avatarWrap">
              <VanImage
                round
                fit="cover"
                width="56"
                height="56"
                :src="resolveAvatar(item)"
                :class="$style.avatar"
              />
              <span
                v-if="item.gender !== null"
                :class="[
                  $style.genderDot,
                  item.gender === 0 ? $style.genderDotFemale : $style.genderDotMale,
                ]"
              >
                {{ item.gender === 0 ? '♀' : '♂' }}
              </span>
            </div>
            <div :class="$style.cardInfo">
              <div :class="$style.nameRow">
                <span :class="$style.name">{{ item.name }}</span>
                <span :class="$style.title">{{ item.title }}</span>
              </div>
              <p :class="$style.firm">{{ item.lawFirm }}</p>
              <div :class="$style.metaRow">
                <span :class="$style.metaItem">
                  <VanIcon name="location-o" size="12" />
                  {{ item.city }}
                </span>
                <span :class="$style.metaItem">
                  <VanIcon name="clock-o" size="12" />
                  {{ item.yearsOfPractice }}年
                </span>
              </div>
            </div>
            <VanIcon name="arrow" size="16" color="#c8c9cc" :class="$style.arrow" />
          </div>

          <!-- 擅长领域标签 -->
          <div :class="$style.tagRow" v-if="parseExpertise(item.expertise).length">
            <VanTag
              v-for="tag in parseExpertise(item.expertise)"
              :key="tag"
              plain
              type="primary"
              size="medium"
              :class="$style.tag"
            >
              {{ tag }}
            </VanTag>
          </div>

          <!-- 底部统计 -->
          <div :class="$style.cardFoot">
            <div :class="$style.stat">
              <VanIcon name="star-o" size="14" color="#ffa41c" />
              <span :class="$style.statVal">{{ item.rating || '-' }}</span>
              <span :class="$style.statLabel">评分</span>
            </div>
            <div :class="$style.stat">
              <VanIcon name="chat-o" size="14" color="#1989fa" />
              <span :class="$style.statVal">{{ item.consultationCount }}</span>
              <span :class="$style.statLabel">咨询</span>
            </div>
            <div :class="$style.priceTag">
              {{ item.priceText || '面议' }}
            </div>
          </div>
        </div>
      </VanList>

      <VanEmpty
        v-if="!loading && finished && !lawyers.length"
        :class="$style.status"
        description="暂无律师数据"
      />
    </template>
  </section>
</template>

<script lang="ts" setup>
import { showToast } from 'vant';
import { getLawyerList } from '@/services/lawyer';
import type { LawyerListItem } from '@/types/lawyer';
import { getLawyerDefaultAvatar } from '@/shared/avatar';

const router = useRouter();

const keyword = ref('');
const lawyers = ref<LawyerListItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const hasError = ref(false);
const page = ref(1);
const pageSize = 10;

const fetchList = async ({ reset = false } = {}) => {
  if (reset) {
    page.value = 1;
    finished.value = false;
    lawyers.value = [];
  }

  if (finished.value) {
    return;
  }

  loading.value = true;
  hasError.value = false;

  try {
    const data = await getLawyerList({
      page: page.value,
      pageSize,
      keyword: keyword.value.trim() || undefined,
    });

    lawyers.value = reset ? data.list : lawyers.value.concat(data.list);
    finished.value = !data.hasMore || data.list.length === 0;
    page.value += 1;
  } catch {
    hasError.value = true;
    showToast('律师列表加载失败');
  } finally {
    loading.value = false;
  }
};

const onLoad = () => {
  fetchList();
};

const onSearch = () => {
  fetchList({ reset: true });
};

const onRetry = () => {
  fetchList({ reset: true });
};

const goDetail = (id: string) => {
  router.push(`/lawyers/${id}`);
};

const parseExpertise = (expertise: string) => {
  return expertise
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const resolveAvatar = (item: LawyerListItem) => item.avatarUrl || getLawyerDefaultAvatar(item.name);
</script>

<style lang="postcss" module>
.container {
  height: calc(100vh - 50px);
  background: #f5f6f8;
  overflow-y: auto;
}

.header {
  padding: 8px 12px 0;
  background: #fff;
}

.status {
  margin-top: 120px;
}

/* 卡片 */
.card {
  margin: 10px 12px;
  padding: 16px 14px 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 0 0 / 4%);
  transition: box-shadow 0.2s;
}

.card:active {
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

/* 卡片头部 */
.cardHead {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.avatarWrap {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  display: block;
  border: 2px solid #f0f0f0;
  background: #f2f3f5;
}

.genderDot {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  color: #fff;
}

.genderDotMale {
  background: #4d8cf5;
}

.genderDotFemale {
  background: #f5708f;
}

.cardInfo {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.nameRow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title {
  font-size: 12px;
  color: #a0a0a0;
  padding: 1px 6px;
  border-radius: 4px;
  background: #f5f5f5;
  white-space: nowrap;
  flex-shrink: 0;
}

.firm {
  margin: 5px 0 0;
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metaRow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 5px;
}

.metaItem {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #999;
}

.arrow {
  flex-shrink: 0;
  align-self: center;
  margin-left: auto;
}

/* 标签行 */
.tagRow {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.tag {
  margin-right: 0;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  color: #1989fa;
  border-color: #d9e8ff;
  background: #f0f7ff;
}

/* 底部统计 */
.cardFoot {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.statVal {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.statLabel {
  font-size: 11px;
  color: #aaa;
  margin-left: 1px;
}

.priceTag {
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: #ee0a24;
  background: #fff0f0;
  padding: 2px 10px;
  border-radius: 12px;
}
</style>
