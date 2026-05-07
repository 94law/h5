import fs, { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import converter from 'swagger2openapi';
import openapiTS from 'openapi-typescript';
import parser from 'yargs-parser';
import { mkdirp } from 'mkdirp';

const argv = parser(process.argv.slice(2), {
  alias: {
    config: ['c'],
  },
});

const isBuiltinRef = (value) => {
  if (value == null || value.additionalProperties == null) {
    return false;
  }

  const ref = value.additionalProperties.$ref;

  return typeof ref === 'string' && (ref.endsWith('List') || ref.endsWith('Map'));
};

const cleanBuiltinType = (openapi) => {
  if (!openapi.components) return;

  const { schemas } = openapi.components;
  const keys = Object.keys(schemas);

  for (let i = 0; i < keys.length; i++) {
    const value = schemas[keys[i]];

    if (isBuiltinRef(value)) {
      delete value.additionalProperties.$ref;
    }
  }
};

const trimStartForPaths = (openapi, prefix) => {
  const { paths } = openapi;
  const keys = Object.keys(paths);
  const regex = new RegExp(`^${Array.isArray(prefix) ? `(?:${prefix.join('|')})` : prefix}`);

  openapi.paths = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    const newKey = key.replace(regex, '');
    openapi.paths[newKey] = paths[key];
  }
};

const performResult = (err, res, config) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const { openapi } = res;

  cleanBuiltinType(openapi);

  if (config.trimStart) {
    trimStartForPaths(openapi, config.trimStart);
  }

  openapiTS(openapi).then((value) => {
    const dir = path.dirname(config.output);

    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }

    fs.writeFileSync(config.output ?? 'schema.ts', value, 'utf8');
  });
};

const startup = (configPath) => {
  import(pathToFileURL(configPath)).then((c) => {
    const config = c.default ?? c;

    config.forEach((item) => {
      if (item.src.startsWith('http')) {
        converter.convertUrl(
          item.src,
          {
            patch: true,
            warnOnly: true,
          },
          (err, res) => {
            performResult(err, res, item);
          },
        );
      } else {
        converter.convertFile(
          item.src,
          {
            patch: true,
            warnOnly: true,
          },
          (err, res) => {
            performResult(err, res, item);
          },
        );
      }
    });
  });
};

const configPath = path.resolve(process.cwd(), argv.config ?? './openapi.config.js');

if (existsSync(configPath)) {
  startup(configPath);
} else {
  console.error('Configuration file not found, please check the path: ', configPath);
}
