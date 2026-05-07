import { createApp } from 'vue';
import createPinia from '@/stores';
import ChunkLoadError from '@/plugins/chunk-load-error';

import App from './App.vue';
import router from './router';
import { installGuards } from './guards';
import setSafeAreaInsetProperty from '@/shared/setSafeAreaInsetProperty';

// 引入公共组件
import XFontIcon from './x-components/font-icon';
import XPopup from '@/x-components/popup';
import XCountUp from '@/x-components/count-up';
import XPlaceholder from '@/x-components/placeholder';
// vant函数组件样式
import 'vant/es/toast/style';
import 'vant/es/dialog/style';

import '@/styles/reset.css';
import '@/styles/vars.css';
import '@/styles/base.css';

// 基于CSS变量的安全区处理
setSafeAreaInsetProperty();

/**
 * 暴露全局router提供给axios使用
 */
window.__g_router__ = router;

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(ChunkLoadError, { router });

// 通用组件
app.use(XFontIcon);
app.use(XPopup);
app.use(XCountUp);
app.use(XPlaceholder);

/**
 * 安装路由导航守卫/拦截器
 */
installGuards(router, pinia);

app.mount('#app');

export default app;
