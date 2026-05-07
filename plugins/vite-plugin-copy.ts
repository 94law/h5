import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import fg from 'fast-glob';
import globParent from 'glob-parent';
import type { Plugin } from 'vite';

export type TransformType = (contents: Buffer, name: string) => Promise<Buffer> | Buffer;

export interface TargetType {
  readonly src: string;
  readonly dest: string;
  readonly ignoreFiles?: string[];
  readonly transform?: TransformType;
}

interface CopyOptions {
  readonly targets?: readonly TargetType[];
}

const objectToString = Object.prototype.toString;
const isPlainObject = (value: any) => {
  return objectToString.call(value) === '[object Object]';
};

const copyFile = async (
  context: string,
  filePath: string,
  target: string,
  transform?: TransformType,
) => {
  const targetFilePath = path.resolve(target, path.relative(context, filePath));
  const targetDirPath = path.dirname(targetFilePath);

  if (!existsSync(targetDirPath)) {
    await fs.mkdir(targetDirPath, { recursive: true });
  }

  if (typeof transform === 'function') {
    const contents = await transform(await fs.readFile(filePath), filePath);
    await fs.writeFile(targetFilePath, contents);
  } else {
    await fs.copyFile(path.resolve(filePath), targetFilePath);
  }
};

export default function copy(options: CopyOptions = {}): Plugin {
  const { targets } = options;

  return {
    name: 'copy',
    config: (config) => {
      config.build = config.build ?? {};
      config.build.copyPublicDir = false;
    },
    writeBundle: async () => {
      if (targets && targets.length > 0) {
        for (const target of targets) {
          if (!isPlainObject(target)) {
            throw new Error(`${target} target must be an object`);
          }

          const { src, dest, ignoreFiles, transform } = target;

          if (!src || !dest) {
            throw new Error(`${target} target must have "src" and "dest" properties`);
          }

          const matchedPaths = await fg(src, {
            ignore: ignoreFiles,
            absolute: true,
          });
          const context = globParent(src);

          if (matchedPaths.length > 0) {
            for (const matchedPath of matchedPaths) {
              await copyFile(context, matchedPath, dest, transform);
            }
          }
        }
      }
    },
  };
}
