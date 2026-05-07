import { defineStore } from 'pinia';
import * as userService from '@/services/user';
import type { QueryProfileType } from '@/services/user';
import { isUndefined } from 'lodash-es';

export interface UserState {
  token: string | null;
  isNewUser: boolean | null;
  profile: QueryProfileType['Result'];
}

interface UpdatePayload {
  token?: string | null;
  phoneNumber?: string | null;
  isNewUser?: boolean;
}

interface LoginPayload {
  account: string;
  password: string;
}

interface RegisterPayload {
  phone: string;
  nickname: string;
  password: string;
  email?: string;
}

interface FetchProfilePayload {
  redirectToLogin?: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: null,
    isNewUser: null,
    profile: {},
  }),
  getters: {
    isLogin(state) {
      return state.token != null && state.token !== '';
    },
    isNotLogin() {
      return !this.isLogin;
    },
  },
  actions: {
    update(payload: UpdatePayload) {
      this.token = isUndefined(payload.token) ? this.token : payload.token;
    },

    updateProfile(payload: QueryProfileType['Result'] = {}) {
      this.profile = payload;
    },

    /**
     * 登录（手机号 + 密码）
     */
    async login(payload: LoginPayload) {
      const data = await userService.login({
        account: payload.account,
        password: payload.password,
      });

      this.update({
        token: data.accessToken,
        phoneNumber: payload.account,
        isNewUser: false,
      });
    },

    /**
     * 注册
     */
    async register(payload: RegisterPayload) {
      const data = await userService.register({
        phone: payload.phone,
        nickname: payload.nickname,
        password: payload.password,
        email: payload.email,
      });

      this.update({
        token: data.accessToken,
        phoneNumber: payload.phone,
        isNewUser: true,
      });
    },

    /**
     * 退出
     */
    async logout() {
      await userService.logout();
      this.$reset();
    },

    /**
     * 获取用户信息
     */
    async fetchProfile({ redirectToLogin }: FetchProfilePayload = {}) {
      const profile = await userService.queryProfile({ redirectToLogin });

      this.updateProfile(profile);

      return profile;
    },
  },
  persist: {
    paths: ['token'],
  },
});
