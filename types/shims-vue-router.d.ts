import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    excludeLogin?: boolean;
    canBack?: boolean;
    customNavBar?: boolean;
  }
}
