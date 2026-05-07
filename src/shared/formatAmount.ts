import BigNumber from 'bignumber.js';
import { memoize } from 'lodash-es';

const makeFormatOptions = memoize((format: string): [number, BigNumber.Format] => {
  const [integer, decimal] = format.split('.');
  const decimalPlaces = decimal ? decimal.length : 0;
  const hasSeparator = integer.includes(',');
  const prefix = format.match(/^(\D*)/)?.[0];
  const suffix = format.match(/(\D+)$/)?.[0];

  return [
    decimalPlaces,
    {
      prefix,
      decimalSeparator: '.',
      groupSeparator: hasSeparator ? ',' : '',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: ' ',
      fractionGroupSize: 0,
      suffix,
    },
  ];
});

/**
 * 格式化金额
 * @param {Number} value 以分为单位的金额
 * @param {String} format 金额格式
 * @example
 * 假如金额为：100000，单位：分
 * formatAmount -> 1,000.00
 * formatAmount('0,0') -> 1,000
 * formatAmount('0,0.00') -> 1,000.00
 * formatAmount('0,0.0') -> 1,000.0
 * formatAmount('0.00') -> 1000.00
 * formatAmount('0') -> 1000
 */
export default function formatAmount(value?: number | string | null, format = '0,0.00'): string {
  if (value == null) return '-';
  if (!value) return '0.00';

  const [decimalPlaces, options] = makeFormatOptions(format);
  return new BigNumber(value).div(100).toFormat(decimalPlaces, options);
}
