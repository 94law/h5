import path from 'node:path';
import sprites from 'postcss-sprites';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 匹配CSS Sprites 图片分组的正则
 * @type {RegExp}
 */
const spriteRegex = /\?__sprite=([^\\/]+)$/;

export default function (options = {}) {
  const { spritePath = path.resolve(__dirname, 'sprites').split(path.sep).join(path.posix.sep) } =
    options;

  return sprites({
    spritePath,
    retina: true,
    basePath: '/',
    spritesmith: {
      padding: 1,
    },
    hooks: {
      onUpdateRule(rule, token, image) {
        const { ratio, coords, spriteWidth, spriteHeight } = image;
        const posX = -1 * Math.abs(coords.x / ratio);
        const posY = -1 * Math.abs(coords.y / ratio);
        const sizeX = spriteWidth / ratio;
        const sizeY = spriteHeight / ratio;
        const imageUrl = image.spritePath;

        token
          .cloneAfter({
            type: 'decl',
            prop: 'background-image',
            value: `url(${imageUrl})`,
          })
          .cloneAfter({
            prop: 'background-position',
            value: `${posX}px ${posY}px`,
          })
          .cloneAfter({
            prop: 'background-size',
            value: `${sizeX}px ${sizeY}px`,
          });
      },
      onSaveSpritesheet(opts, spritesheet) {
        const groups = [];
        const scaleFactors = [];

        spritesheet.groups.forEach((group) => {
          if (/^@\d+x$/.test(group)) {
            scaleFactors.push(group);
          } else {
            groups.push(group);
          }
        });

        const filename = `${groups.join('.') + scaleFactors.join('.')}.${spritesheet.extension}`;
        return path.join(opts.spritePath, filename);
      },
    },
    filterBy(image) {
      if (spriteRegex.test(image.originalUrl)) {
        return Promise.resolve();
      }

      return Promise.reject();
    },
    groupBy(image) {
      const group = image.originalUrl.match(spriteRegex);
      if (group && group[1]) {
        return Promise.resolve(group[1]);
      }

      return Promise.reject();
    },
  });
}
