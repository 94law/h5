import path from 'node:path';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import otf2ttf from './plugins/otf2ttf.js';
import fontmin from './plugins/fontmin.js';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function () {
  return gulp
    .src('../fonts/*.{ttf,otf}', { cwd: __dirname })
    .pipe(gulpif((file) => path.extname(file.path) === '.otf', otf2ttf()))
    .pipe(fontmin())
    .pipe(gulp.dest('src/assets/fonts'));
}
