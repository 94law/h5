/**
 * 常见复姓列表
 */
const COMPOUND_SURNAMES = new Set([
  '欧阳',
  '司马',
  '上官',
  '诸葛',
  '东方',
  '西门',
  '独孤',
  '慕容',
  '公孙',
  '尉迟',
  '皇甫',
  '长孙',
  '宇文',
  '令狐',
  '端木',
  '申屠',
  '夏侯',
  '轩辕',
  '太史',
  '宗政',
  '闻人',
  '鲜于',
  '濮阳',
  '闾丘',
  '司徒',
  '司空',
  '亓官',
  '司寇',
  '巫马',
  '公西',
  '壤驷',
  '公良',
  '漆雕',
  '乐正',
  '宰父',
  '谷梁',
  '拓跋',
  '夹谷',
  '赫连',
  '钟离',
  '公仪',
  '公冶',
  '太叔',
  '万俟',
  '南荣',
  '东郭',
  '北堂',
  '南门',
  '呼延',
  '羊舌',
  '微生',
  '梁丘',
  '左丘',
  '闾丘',
  '段干',
  '百里',
  '东门',
  '子车',
  '第五',
]);

/**
 * 律师默认头像（DiceBear initials 正式风格）
 * 彩色圆形底 + 姓名后两字，自动处理复姓
 * @param name 律师姓名
 * @returns DiceBear SVG URL
 */
export function getLawyerDefaultAvatar(name: string): string {
  let text: string;

  if (name.length >= 3 && COMPOUND_SURNAMES.has(name.slice(0, 2))) {
    // 复姓：取名字部分（去掉前两字复姓），若名字不足两字则取名字
    const givenName = name.slice(2);
    text = givenName.length >= 2 ? givenName.slice(-2) : givenName;
  } else {
    // 单姓或不足三字：取后两字
    text = name.length > 2 ? name.slice(-2) : name;
  }

  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(text)}&fontSize=38`;
}
