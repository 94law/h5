import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults, ConfigEnv } from 'vitest/config';
import viteConfig from './vite.config';

export default function (configEnv: ConfigEnv) {
  return mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    }),
  );
}
