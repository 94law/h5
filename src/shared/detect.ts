const ua = window.navigator.userAgent;

/**
 * @reference 部分判断参考 https://github.com/hgoebl/mobile-detect.js
 */
export const detectEnv = {
  /**
   * 宜享花
   */
  yxh: /xiaodai/i.test(ua),
  /**
   * 宜人贷
   */
  yrd: /yrd/i.test(ua),
  /**
   * iOS
   */
  ios: /\biPhone|\biPod|\biPad|AppleCoreMedia/i.test(ua),
  /**
   * Android
   */
  android: /Android/i.test(ua),
  /**
   * 微信
   */
  wechat: /\bMicroMessenger\b/i.test(ua),
  /**
   * 微博
   */
  weibo: /weibo/i.test(ua),
  /**
   * UC浏览器
   */
  ucbrowser: /UC.*Browser|UCWEB/i.test(ua),
  /**
   * 小米浏览器
   */
  miuibrowser: /MiuiBrowser/i.test(ua),
  /**
   * QQ浏览器
   */
  qqbrowser: /MQQBrowser/i.test(ua),
  /**
   * 微信小程序
   */
  weapp: /miniprogram/i.test(ua),
  /**
   * 支付宝小程序
   */
  aliapp: /aliapp/i.test(ua),
  /**
   * 抖音/字节小程序
   */
  dyapp: /toutiaomicroapp/i.test(ua),
};
