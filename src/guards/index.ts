import clearPollGuard from './clearPoll';
import loginGuard from './login';
import referrerGuard from './referrer';
import titleGuard from './title';
import type { Pinia } from 'pinia';
import type { Router } from 'vue-router';
import bodyStyleGuard from './bodyStyle';

export function installGuards(router: Router, pinia: Pinia) {
  /**
   * 顺序有要求，请勿随意调整
   */
  [
    clearPollGuard, // beforeEach
    loginGuard, // beforeEach
    referrerGuard, // beforeEach
    bodyStyleGuard, // afterEach
    titleGuard, // afterEach
  ].forEach((guard) => guard(router, pinia));
}
