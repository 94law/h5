import path from 'node:path';
import process from 'node:process';
import presetEnv from 'postcss-preset-env';
import nested from 'postcss-nested';
import flexbugs from 'postcss-flexbugs-fixes';
import pxToViewport from 'postcss-px-to-viewport';
import viewportHeightCorrection from 'postcss-viewport-height-correction';
import calc from 'postcss-calc';
import alias from './plugins/postcss-alias.js';
import sprites from './plugins/postcss-sprites.js';

export default function ({ env }) {
  return {
    plugins: [
      alias({
        '~': process.cwd(),
        '@': path.resolve('src'),
      }),
      flexbugs(),
      nested(),
      presetEnv({
        features: {
          'nesting-rules': true,
          'custom-properties': {
            overrideImportFromWithRoot: true,
            disableDeprecationNotice: true,
          },
        },
        importFrom: [
          {
            customProperties: {
              '--safe-area-inset-top': '0px',
              '--safe-area-inset-bottom': '0px',
            },
          },
          path.resolve('./src/styles/vars.css'),
        ],
      }),
      pxToViewport({
        unitToConvert: 'dpx',
        viewportWidth: 750,
        landscapeWidth: 1334,
      }),
      viewportHeightCorrection(),
      calc(),
      // css sprites
      env === 'production' &&
        sprites({
          spritePath: path.resolve('.sprites').split(path.sep).join(path.posix.sep),
        }),
    ].filter(Boolean),
  };
}
