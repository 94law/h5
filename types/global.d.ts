/* eslint-disable @typescript-eslint/no-unused-vars */
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type Numberish = number | string;

/**
 * RSA/AES加解密SDK
 */
declare const CECryptojs: import('../public/sdk/ce-cryptojs').CECryptojsStatic;

interface Window {
  __g_router__: import('vue-router').Router;
  __vue_router_referrer__: string;
}

interface BridgeResponse<T = any> {
  code: string;
  message: string;
  data?: T;
  type?: string;
}

interface Error {
  response?: import('axios').AxiosResponse | BridgeResponse;
}

interface Document {
  webkitHidden: boolean;
  msHidden: boolean;
}

type TimeoutId = ReturnType<typeof setTimeout> | null;
