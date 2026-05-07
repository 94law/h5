<template>
  <ConfigProvider :theme-vars="themeVars" theme-vars-scope="global">
    <RouterView />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider, type ConfigProviderThemeVars } from 'vant';

const themeVars: ConfigProviderThemeVars = {
  buttonPrimaryBackground: 'var(--primary-color)',
  buttonPrimaryBorderColor: 'var(--primary-color)',
  buttonDefaultHeight: '52px',
  buttonRadius: '10px',
  buttonDefaultBorderColor: 'var(--primary-color)',
};
</script>
