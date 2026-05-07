const urlRegex = /url\(\s*(['"])?([^'"]+)\1\s*\)/g;

/**
 * 判断是否为需要排除的URL地址
 * @param {String} url
 * @returns
 */
const isExcludeUrl = (url) =>
  url == null ||
  url.startsWith('/') ||
  url.startsWith('//') ||
  url.startsWith('http://') ||
  url.startsWith('https://') ||
  url.startsWith('data:');

export default function (alias = {}) {
  const keys = Object.keys(alias);
  const regexes = keys.reduce((acc, key) => {
    acc[key] = new RegExp(`${key}/`, 'g');
    return acc;
  }, {});

  return {
    postcssPlugin: 'postcss-alias',
    Once(root) {
      root.walkAtRules('import', (rule) => {
        let params = rule.params;
        for (let i = 0, key; (key = keys[i++]); ) {
          if (key && rule.params.includes(key)) {
            params = params.replace(regexes[key], `${alias[key]}/`);
          }
        }

        if (params != rule.params) {
          rule.params = params;
        }
      });

      root.walkDecls((node) => {
        if (urlRegex.test(node.value)) {
          node.value = node.value.replace(urlRegex, (matched, _, url) => {
            if (isExcludeUrl(url)) return matched;

            let newUrl = url;
            for (let i = 0, key; (key = keys[i++]); ) {
              if (key && newUrl.includes(key)) {
                newUrl = newUrl.replace(regexes[key], `${alias[key]}/`);
              }
            }

            if (newUrl === url) {
              return matched;
            }

            return matched.split(url).join(newUrl);
          });
        }
      });
    },
  };
};

