import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig, splitVendorChunkPlugin, loadEnv, type ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import UnpluginInjectPreload from 'unplugin-inject-preload/vite';
import copy from './plugins/vite-plugin-copy';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';

const envDir = path.resolve(process.cwd(), 'env');

// https://vitejs.dev/config/
export default function ({ mode }: ConfigEnv) {
  const env = loadEnv(mode, envDir);
  const baseURL = `${env.VITE_APP_DOMAIN ?? ''}${env.VITE_APP_PREFIX ?? '/'}`;

  return defineConfig({
    base: baseURL,
    envDir,
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
    },
    plugins: [
      vue(),
      vueJsx(),
      splitVendorChunkPlugin(),
      legacy(),
      Icons({
        customCollections: {
          custom: FileSystemIconLoader('./src/assets/icons'),
        },
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './types/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      Components({
        dts: './types/components.d.ts',
        resolvers: [
          VantResolver(),
          IconsResolver({
            prefix: 'icon',
            customCollections: ['custom'],
          }),
        ],
      }),
      ViteEjsPlugin((config) => {
        return {
          env: {
            ...config.env,
            BASE_URL: baseURL,
          },
        };
      }),
      UnpluginInjectPreload({
        files: [
          {
            entryMatch: /\.preload(?:-[\da-zA-Z]+)?\.(?:png|jpeg|jpg|gif|webp|avif)$/,
          },
        ],
      }),
      copy({
        targets: [{ src: 'public/**/*', dest: 'dist/' }],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  });
}
