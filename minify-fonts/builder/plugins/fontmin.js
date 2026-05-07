import path from 'node:path';
import gulp from 'gulp';
import Fontmin from 'fontmin';
import through from 'through2';
import chalk from 'chalk';
import PluginError from 'plugin-error';
import log from 'fancy-log';
import prettyBytes from 'pretty-bytes';
import { Buffer } from 'node:buffer';
import updateFilePath from './update-file-path.js';

/**
 * 打印提取文字的结果
 * @param {*} originalFile
 * @param {*} optimizedFile
 * @param {*} verbose
 */
function printMsg(originalFile, optimizedFile, verbose) {
  const originalSize = originalFile.contents.length;
  const optimizedSize = optimizedFile.contents.length;
  const saved = originalSize - optimizedSize;
  const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
  const savedMsg =
    'saved ' + prettyBytes(saved) + ' - ' + percent.toFixed(1).replace(/\.0$/, '') + '%';
  let msg = saved > 0 ? savedMsg : 'already optimized';

  const optimizedType = (
    path.extname(optimizedFile.path) || path.extname(originalFile.path)
  ).toLowerCase();

  if (verbose) {
    msg =
      chalk.green('✔ ') +
      originalFile.relative +
      ' -> ' +
      optimizedType +
      chalk.gray(' (' + msg + ')');
    log('gulp-fontmin:', msg);
  }
}

/**
 * 读取文本内容
 * @param {String} textFilePath
 * @param {Function} callback
 */
function readText(textFilePath, callback) {
  const buf = [];

  gulp
    .src(textFilePath)
    .on('data', (file) => {
      buf.push(file.contents);
    })
    .on('end', () => {
      const text = Buffer.concat(buf).toString('utf-8');

      callback(text);
    });
}

/**
 * 该模块基于gulp-fontmin进行改造
 * 字体文件(.ttf)与要提取的文本(.txt)名字保持一致则会自动提取字体
 * @returns {stream.Transform}
 */
export default function (opts = {}) {
  let totalFiles = 0;

  return through.obj(
    function (file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      if (file.isStream()) {
        cb(new PluginError('gulp-fontmin', 'Streaming not supported'));
        return;
      }

      const { dir, name, ext } = path.parse(file.path);

      if (ext !== '.ttf') {
        if (opts.verbose) {
          log('gulp-fontmin: Skipping unsupported font ' + chalk.blue(file.relative));
        }

        cb(null, file);
        return;
      }

      const textFilePath = path.format({
        dir,
        name,
        ext: '.txt',
      });

      readText(textFilePath, (text) => {
        const fontmin = new Fontmin()
          .src(file.contents)
          .use(
            updateFilePath({
              path: file.path,
            }),
          )
          .use(
            Fontmin.glyph({
              ...opts,
              text,
              hinting: false,
            }),
          )
          .use(Fontmin.ttf2eot())
          .use(Fontmin.ttf2woff())
          .use(Fontmin.ttf2woff2())
          .use(Fontmin.ttf2svg())
          .use(Fontmin.css({ ...opts, fontFamily: name }));

        if (opts.use) {
          opts.use.forEach(fontmin.use.bind(fontmin));
        }

        fontmin.run((err, files) => {
          if (err) {
            cb(
              new PluginError('gulp-fontmin:', err, {
                fileName: file.path,
              }),
            );
            return;
          }

          files.forEach((optimizedFile, index) => {
            if (index === 0) {
              file.contents = optimizedFile.contents;
            } else {
              const gulpFile = file.clone();
              gulpFile.path = gulpFile.path.replace(/.ttf$/, path.extname(optimizedFile.path));
              gulpFile.contents = optimizedFile.contents;

              this.push(gulpFile);
            }

            printMsg(file, optimizedFile, opts.verbose);
          });

          totalFiles++;

          cb(null, file);
        });
      });
    },
    function (cb) {
      if (opts.quiet) {
        cb();
      }
      let msg = 'Minified ' + totalFiles + ' ';

      msg += totalFiles === 1 ? 'font' : 'fonts';

      log('gulp-fontmin:', msg);
      cb();
    },
  );
}
