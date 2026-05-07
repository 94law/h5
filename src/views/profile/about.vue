<template>
  <section :class="$style.container">
    <div :class="$style.logoSection">
      <img src="/logo.svg" alt="logo" :class="$style.logo" />
      <h2 :class="$style.appName">94律师咨询</h2>
      <p :class="$style.version">版本 1.0.0</p>
    </div>

    <VanCellGroup inset :class="$style.section">
      <VanCell title="用户协议" is-link />
      <VanCell title="隐私政策" is-link />
      <VanCell title="意见反馈" is-link />
    </VanCellGroup>

    <div :class="$style.footer">
      <p>94律师咨询 - 您身边的法律服务专家</p>
      <p>提供专业律师在线咨询服务</p>
      <p :class="$style.copyright">Copyright © 2024-2026 94law.cn</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
// 关于我们 - 静态页面
</script>

<style lang="postcss" module>
.container {
  min-height: var(--viewport-height);
  background: #f7f8fa;
  padding-bottom: env(safe-area-inset-bottom);
}

.logoSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 30px;
  background: #fff;
  margin-bottom: 12px;
}

.logo {
  width: 72px;
  height: 72px;
  border-radius: 16px;
}

.appName {
  margin: 14px 0 6px;
  font-size: 20px;
  font-weight: var(--font-weight-semi-bold);
  color: var(--important-title-color);
}

.version {
  margin: 0;
  font-size: 14px;
  color: var(--unimportant-color);
}

.section {
  margin-top: 12px;
}

.footer {
  padding: 40px 20px;
  text-align: center;
  font-size: 13px;
  color: var(--unimportant-color);
  line-height: 1.8;
}

.footer p {
  margin: 0;
}

.copyright {
  margin-top: 12px !important;
  color: #ccc;
  font-size: 12px;
}
</style>
