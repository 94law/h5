import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/not-found.vue';
import type { RouteRecordRaw } from 'vue-router';
import StandardLayout from '@/layouts/standard-layout.vue';
import TabLayout from '@/layouts/tab-layout.vue';

/**
 * 每个路由的meta信息中可以设置以下参数
 */
const routes: RouteRecordRaw[] = [
  /**
   * Tab 布局 - 带底部导航栏
   */
  {
    path: '/',
    component: TabLayout,
    meta: {
      hasTabBar: true,
    },
    children: [
      {
        path: '/',
        redirect: '/lawyers',
      },
      /**
       * 首页 - 律师列表
       */
      {
        path: '/lawyers',
        meta: {
          excludeLogin: true,
        },
        component: () => import('@/views/lawyers/index.vue'),
      },
      /**
       * 圈子 - 案例分享
       */
      {
        path: '/community',
        meta: {
          excludeLogin: true,
        },
        component: () => import('@/views/community/index.vue'),
      },
      /**
       * 我的 - 个人中心
       */
      {
        path: '/profile',
        meta: {
          excludeLogin: true,
        },
        component: () => import('@/views/profile/index.vue'),
      },
    ],
  },
  /**
   * 我的 - 二级页面，不展示 Tab
   */
  {
    path: '/profile',
    component: StandardLayout,
    meta: {
      hasNavBarLayout: true,
    },
    children: [
      {
        path: 'posts',
        meta: { title: '我的发布' },
        component: () => import('@/views/profile/posts.vue'),
      },
      {
        path: 'favorites',
        meta: { title: '我的收藏' },
        component: () => import('@/views/profile/favorites.vue'),
      },
      {
        path: 'settings',
        meta: { title: '设置' },
        component: () => import('@/views/profile/settings.vue'),
      },
      {
        path: 'about',
        meta: { title: '关于我们' },
        component: () => import('@/views/profile/about.vue'),
      },
      {
        path: 'edit',
        meta: { title: '编辑资料' },
        component: () => import('@/views/profile/edit.vue'),
      },
    ],
  },
  /**
   * 律师详情 - 二级页面，不展示 Tab
   */
  {
    path: '/lawyers/:id',
    component: StandardLayout,
    meta: {
      hasNavBarLayout: true,
      title: '律师详情',
      excludeLogin: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/lawyers/detail.vue'),
      },
    ],
  },
  /**
   * 圈子案例详情 - 二级页面，不展示 Tab
   */
  {
    path: '/community/:id',
    component: StandardLayout,
    meta: {
      hasNavBarLayout: true,
      title: '案例详情',
      excludeLogin: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/community/detail.vue'),
      },
    ],
  },
  /**
   * 发布案例 - 二级页面，需要登录
   */
  {
    path: '/community/publish',
    component: StandardLayout,
    meta: {
      hasNavBarLayout: true,
      title: '发布案例',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/community/publish.vue'),
      },
    ],
  },
  /**
   * 登录
   */
  {
    path: '/login',
    meta: {
      excludeLogin: true,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PREFIX),
  routes,
});

export default router;
