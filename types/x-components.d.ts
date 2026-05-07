export {};

declare module 'vue' {
  export interface GlobalComponents {
    XPopup: typeof import('@/x-components/popup').XPopup;
    XCountUp: typeof import('@/x-components/count-up').XCountUp;
    XPlaceholder: typeof import('@/x-components/placeholder').XPlaceholder;
    XFontIcon: typeof import('@/x-components/font-icon').XFontIcon;
    XSvgIcon: typeof import('@/x-components/svg-icon').XSvgIcon;
  }
}
