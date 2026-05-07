const cities: Record<string, any> = {
  '11': '北京',
  '12': '天津',
  '13': '河北',
  '14': '山西',
  '15': '内蒙古',
  '21': '辽宁',
  '22': '吉林',
  '23': '黑龙江',
  '31': '上海',
  '32': '江苏',
  '33': '浙江',
  '34': '安徽',
  '35': '福建',
  '36': '江西',
  '37': '山东',
  '41': '河南',
  '42': '湖北 ',
  '43': '湖南',
  '44': '广东',
  '45': '广西',
  '46': '海南',
  '50': '重庆',
  '51': '四川',
  '52': '贵州',
  '53': '云南',
  '54': '西藏 ',
  '61': '陕西',
  '62': '甘肃',
  '63': '青海',
  '64': '宁夏',
  '65': '新疆',
  '71': '台湾',
  '81': '香港',
  '82': '澳门',
  '91': '国外',
};

/**
 * 判断是否中文名
 */
export function isChineseName(value: string) {
  return Boolean(value) && /^[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF·•]{2,20}$/.test(value);
}

/**
 * 判断是否身份证
 */
export function isIdentityNumber(value: string) {
  return (
    Boolean(value) &&
    /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value) &&
    cities[value.substr(0, 2)] !== ''
  );
}

/**
 * 判断是否邮箱
 */
export function isEmail(value: string) {
  return (
    Boolean(value) &&
    /^[a-zA-Z\d]+(?:[._-][a-zA-Z\d]+)?@[a-zA-Z\d]+(?:[-.][a-zA-Z\d]+)?(?:\.[a-zA-Z]{2,8})$/.test(
      value,
    )
  );
}

/**
 * 判断是否手机号
 */
export function isPhoneNumber(value: string) {
  return Boolean(value) && /^1\d{10}$/.test(value);
}

/**
 * 判断是否公司名称
 */
export function isCompanyName(value: string) {
  return Boolean(value) && /[\u4e00-\u9fff]{4,}/.test(value); // &&; // && /^[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\w-()－（）]+$/.test(value);
}

/**
 * 判断至少4个字符
 */
export function is4Byte(value: string) {
  return value.replace(/[\u4e00-\u9fa5]/g, () => 'xx').length > 4;
}

/**
 * 判断是否地址/允许输入数字，汉字
 */
export function isAddress(value: string) {
  return Boolean(value) && /[\u4e00-\u9fff0-9]{6,}/.test(value); // && /^[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFFa-zA-Z0-9-－]+$/.test(value);
}
/**
 * 判断是否地址至少4个字
 */
export function is4ByteAddress(value: string) {
  return Boolean(value) && /[\u4e00-\u9fff]{4,}/.test(value); // && /^[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFFa-zA-Z0-9-－]+$/.test(value);
}

/**
 * 单位地址大于3个汉字
 */
export function isCompanyAddress(value: string) {
  return Boolean(value) && /[\u4e00-\u9fff]{3,}/.test(value);
}

/**
 * 判断邮政编码
 */
export function isPostCode(value: string) {
  return Boolean(value) && /^\d{6}$/.test(value);
}

/**
 * 判断短信验证码
 */
export function isSmsCode(value: string) {
  return Boolean(value) && /^\d{6}$/.test(value);
}

/**
 * 判断贷款金额1-500正整数
 */
export function isLoanAmount(value: string) {
  return Boolean(value) && /(^[1-4][0-9]{1,2}$)|(^[1-9]$)|500|50/.test(value);
}

/**
 * 判断图形验证码
 */
export function isCaptureCode(value: string) {
  return Boolean(value) && /^[A-Za-z0-9]{4}$/.test(value);
}

/**
 * 判断车牌号
 */
export function isCarNo(value: string) {
  return Boolean(value) && /^[A-Za-z0-9]{6,7}$/.test(value);
}
