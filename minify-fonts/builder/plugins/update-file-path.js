import through from 'through2';

/**
 * updateFilePath
 * @param  {Object} opts
 * @returns {stream.Transform}
 */
export default function (opts) {
  opts = opts || {};

  return through.obj(function (file, enc, cb) {
    file.path = opts.path;
    cb(null, file);
  });
}
