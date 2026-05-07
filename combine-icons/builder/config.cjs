const path = require('path');

const context = 'src';
const docDir = 'docs/';

module.exports = {
  /**
   * iconfont配置项
   * @type {Object}
   */
  iconfont: {
    src: '../fonts/**/*.svg',
    dest: path.join(context, 'assets/fonts'),
    /**
     * iconfont
     * @type {String}
     */
    name: 'iconfont',
    /**
     * 图标格式
     */
    formats: ['svg', 'ttf', 'eot', 'woff'],
    /**
     * 样式输出路径
     * @type {String}
     */
    style: path.join(context, 'styles'),
    /**
     * 使用文档输出路径
     * @type {String}
     */
    doc: path.join(docDir, 'iconfont/demo.html'),
  },
};
