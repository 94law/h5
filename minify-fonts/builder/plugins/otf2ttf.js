import Fontmin from 'fontmin';
import through from 'through2';
import path from 'node:path';
import PluginError from 'plugin-error';
import updateFilePath from './update-file-path.js';

/**
 * 将otf文件转换为ttf
 * @returns {stream.Transform}
 */
export default function () {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new PluginError('gulp-otf-to-ttf', 'Streaming not supported'));
      return;
    }

    const { dir, name, ext } = path.parse(file.path);

    if (ext !== '.otf') {
      cb(null, file);
      return;
    }

    const ttfFilePath = path.format({
      dir,
      name,
      ext: '.ttf',
    });

    const fontmin = new Fontmin()
      .src(file.contents)
      .use(
        updateFilePath({
          path: ttfFilePath,
        }),
      )
      .use(Fontmin.otf2ttf());

    fontmin.run((err, files) => {
      if (err) {
        cb(
          new PluginError('gulp-otf-to-ttf:', err, {
            fileName: file.path,
          }),
        );
        return;
      }

      files.forEach((optimizedFile, index) => {
        if (index === 0) {
          file.path = file.path.replace(/.otf$/, path.extname(optimizedFile.path));
          file.contents = optimizedFile.contents;
        } else {
          const gulpFile = file.clone();
          gulpFile.path = gulpFile.path.replace(/.otf$/, path.extname(optimizedFile.path));
          gulpFile.contents = optimizedFile.contents;

          this.push(gulpFile);
        }
      });

      cb(null, file);
    });
  });
}
