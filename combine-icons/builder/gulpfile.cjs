const path = require('path');
const gulp = require('gulp');
const cheerio = require('gulp-cheerio');
const rename = require('gulp-rename');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const config = require('./config.cjs');
const chalk = require('chalk');
const log = require('fancy-log');

function buildIconfont() {
  const font = config.iconfont;
  const destDoc = path.dirname(font.doc);
  const tmpl = {
    css: path.resolve(__dirname, './templates/iconfont.css'),
    html: path.resolve(__dirname, './templates/iconfont.html'),
  };

  return gulp
    .src(font.src, { cwd: __dirname })
    .pipe(
      cheerio({
        run($) {
          $('[opacity="0"]').remove();
        },
        parserOptions: {
          xmlMode: true,
        },
      }),
    )
    .pipe(
      iconfont({
        fontName: font.name,
        formats: font.formats,
        normalize: true,
        fontHeight: 1001,
        timestamp: Math.round(Date.now() / 1000),
      }),
    )
    .on('glyphs', (glyphs) => {
      const data = {
        className: 'x-font-icon',
        fontName: font.name,
        glyphs,
      };

      /* let fontPath = path.relative(font.style, font.dest).split(path.sep).join(path.posix.sep);

      if (!fontPath.endsWith('/')) {
        fontPath = `${fontPath}/`;
      } */

      // 生成iconfont样式
      gulp
        .src(tmpl.css)
        .pipe(consolidate('lodash', { ...data, fontPath: '' }))
        .pipe(rename(`${font.name}.css`))
        .pipe(gulp.dest(font.dest));

      // 生成iconfont文档样式
      gulp
        .src(tmpl.css)
        .pipe(consolidate('lodash', { ...data, fontPath: '' }))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(destDoc));

      // 生成iconfont文档
      gulp
        .src(tmpl.html)
        .pipe(consolidate('lodash', data))
        .pipe(rename(path.basename(font.doc)))
        .pipe(gulp.dest(destDoc));
    })
    .pipe(gulp.dest(font.dest))
    .pipe(gulp.dest(destDoc))
    .on('finish', () => {
      log('Iconfont demo: %s', chalk.green(path.resolve(process.cwd(), 'docs/iconfont/demo.html')));
    });
}

buildIconfont.displayName = 'iconfont:gen';

exports.buildIconfont = buildIconfont;
