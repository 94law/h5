/**
 * 统一转化成中文“xxxx年xx月xx日”格式
 * @param value
 * @returns
 */
export function dateFormatter(value: string | null) {
  // 值为空或不是以 - / . 分割的日期则不进行格式化
  if (!value || !/^(?:\d{2}|\d{4})([-/.])\d{1,2}\1\d{1,2}$/.test(value)) return value;

  const [year, month, date] = value.trim().split(/[-/.]/);

  return `${year}年${month}月${date}日`;
}

/**
 * 去除字符串前后空字符格式
 * @param value
 * @returns
 */
export function trimFormatter(value: string) {
  return value.trim();
}
