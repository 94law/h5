import type { RouteLocationNormalized } from 'vue-router';
import type { RouteLocation } from 'vue-router';

/**
 * 去除字符串中全部空格
 */
export function trimAll(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * 字符串转数值
 */
export function string2number(str: string | number): number {
  if (typeof str === 'number') return str;
  const value = Number.parseFloat(str);

  if (Number.isNaN(value)) {
    return 0;
  }

  return value;
}

/**
 * 判断是否为Promise对象
 */
export function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    value != null &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as Promise<T>).then === 'function' &&
    typeof (value as Promise<T>).catch === 'function'
  );
}

/**
 * 添加px单位
 */
export function addUnit(value?: string | number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`;
  }

  return value;
}

/**
 * 获取指定元素的scrollTop
 */
export function getScrollTop(el: Element | Window) {
  const top = 'scrollTop' in el ? el.scrollTop : el.scrollY;

  return Math.max(0, top);
}

/**
 * 设置iframe跳转方式为顶部窗口
 */
export function setJumpToTopWindow(iframe: HTMLIFrameElement) {
  if (iframe == null || iframe.contentWindow == null) {
    return;
  }

  const doc = iframe.contentWindow.document;
  const a = doc.querySelectorAll('a');

  if (a) {
    for (let i = 0, item; (item = a[i++]); ) {
      if (item.href !== null && item.href !== '') {
        item.target = '_top';
      }
    }
  }
}

/**
 * 获取页面标题
 */
export function getTitle(route: RouteLocation): string {
  if (route.meta?.title) {
    return route.meta.title;
  }

  return '94律师咨询';
}

/**
 * 获取当前域名
 */
export function getCurrentDomain() {
  const { origin } = window.location;

  return `${origin}${import.meta.env.VITE_APP_PREFIX}`;
}

/**
 * 判断是否存在navbar, 自定义navbar不在范围内
 */
export function existsNavBar(route: RouteLocationNormalized) {
  // 页面地址中设置了hasNavBar为0
  if (route.query.hasNavBar === '0') {
    return false;
  }

  // 判断当前路由是否嵌套在包含了nav-bar的布局中
  const nestedNavBarLayout = route.matched?.find((item) => item.meta.hasNavBarLayout);

  if (!nestedNavBarLayout) {
    return false;
  }

  return true;
}
