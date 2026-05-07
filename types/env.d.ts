/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_RUNTIME_ENV: 'dev' | 'testing' | 'staging' | 'prod';
  readonly VITE_APP_MINI_PROGRAM_ENV: 'develop' | 'trial' | 'release';
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_APP_PREFIX: string;
  readonly VITE_APP_SECURITY: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
