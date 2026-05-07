export type DesensitizeType = 'name' | 'idcard' | 'phoneNumber';

export interface Formatter {
  range: [number, number];
  format: (value: string) => string;
}

const getFormatter = (formatters: Formatter[], length: number) => {
  return formatters.find((formatter) => {
    const [min, max] = formatter.range;

    return length >= min && length <= max;
  });
};

const NameFormatters: Formatter[] = [
  {
    range: [0, 3],
    format: (value: string) => `*${value.slice(1)}`,
  },
  {
    range: [4, 6],
    format: (value: string) => `**${value.slice(2)}`,
  },
  {
    range: [7, Infinity],
    format: (value: string) => `${value.slice(0, 2)}****${value.slice(6)}`,
  },
];

const repeatAsterisk = (str: string, start: number, end: number) => {
  return str.slice(0, start) + '*'.repeat(str.slice(start, end).length) + str.slice(end);
};

export default function desensitize(value: string, type: DesensitizeType) {
  if (!value) return '';

  // 姓名
  if (type === 'name') {
    const formatter = getFormatter(NameFormatters, value.length);

    if (formatter?.format) {
      return formatter.format(value);
    }
  }

  // 身份证
  if (type === 'idcard') {
    return repeatAsterisk(value, 5, -3);
  }

  // 手机号
  if (type === 'phoneNumber') {
    return repeatAsterisk(value, 3, -4);
  }

  return value;
}
