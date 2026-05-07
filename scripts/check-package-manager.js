#!/usr/bin/env node

const red = (text) => `\x1b[31m${text}\x1b[0m`;
const cyan = (text) => `\x1b[36m${text}\x1b[39m`;
const ua = process.env.npm_config_user_agent;

if (ua) {
  const [spec] = ua.split(' ');
  const name = spec.slice(0, spec.lastIndexOf('/'));
  const allowPackageManager = process.argv[2] ?? 'npm';

  if (name !== allowPackageManager) {
    switch (allowPackageManager) {
      case 'npm':
        console.log(red(`Use "npm i" or "npm install" for installation in this project.`));
        break;
      case 'pnpm':
        console.log(red('Use "pnpm i" or "pnpm install" for installation in this project.'));
        console.log('');
        console.log(cyan('If you don\'t have pnpm, install it via "npm i -g pnpm".'));
        console.log(cyan('For more details, go to https://pnpm.js.org/'));
        break;
      case 'yarn':
        console.log(red('Use "yarn" for installation in this project.'));
        console.log('');
        console.log(cyan('If you don\'t have yarn, install it via "npm i -g yarn".'));
        console.log(cyan('For more details, go to https://yarnpkg.com/'));
        break;
    }

    console.log('');
    process.exit(1);
  }
}
