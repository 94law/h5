import { isFunction } from 'lodash-es';

interface PollOptions<T> {
  interval?: number;
  maxRetry?: number;
  ignoreError?: boolean;
  shouldStopPolling?: (result: T, count: number) => boolean;
  signal?: AbortSignal;
}

const timers = new Map<string, TimeoutId>();
let seed = 1;

/**
 * 轮询调用一个函数，该函数若返回一个promise，则会等待promise完成后再依据间隔时间执行下次调用
 * @param {Function} fn
 * @param {Object} options
 * @param {Number} options.interval 间隔时间，默认：1000ms
 * @param {Number} options.maxRetry 最大重试次数，如果是无限调用，则设置为-1，默认：-1
 * @param {Boolean} options.ignoreError 忽略异常，默认false
 * @param {Function} options.shouldStopPolling 用于判断是否停止轮询的函数，该函数会传递当前调用后返回的结果以及当前重试次数
 * @param {AbortSignal} options.signal AbortController创建后的signal对象，用于监听AbortController是否调用了abort以便于终止轮询
 * @return {Promise<any>}
 */
export default async function poll<T = any>(
  fn: () => T | Promise<T>,
  options: PollOptions<T> = {},
): Promise<T> {
  if (!isFunction(fn)) {
    throw new Error('The first parameter must be a function');
  }

  const { interval = 1000, maxRetry = -1, ignoreError = false, shouldStopPolling } = options;
  let result: T;
  let count = 1;

  seed += 1;

  if (ignoreError) {
    try {
      result = await fn();
    } catch {
      /* empty */
    }
  } else {
    result = await fn();
  }

  if (interval <= 0 || maxRetry === 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return result!;
  }

  return new Promise((resolve, reject) => {
    const key = `timer_${seed}`;
    const invoke = () => {
      if (
        (maxRetry > 0 && count >= maxRetry) ||
        (isFunction(shouldStopPolling) && shouldStopPolling(result, count))
      ) {
        resolve(result);
        return;
      }

      count += 1;

      const timer = setTimeout(async () => {
        try {
          result = await fn();
          invoke();
        } catch (err) {
          if (ignoreError) {
            invoke();
          } else {
            reject(err);
          }
        }
      }, interval);

      timers.set(`timer_${seed}`, timer);
    };

    if (options.signal instanceof AbortSignal) {
      const onClearTimer = () => {
        const timer = timers.get(key);

        if (timer) {
          clearTimeout(timer);
          timers.delete(key);
          options.signal?.removeEventListener('abort', onClearTimer);
        }
      };

      options.signal.addEventListener('abort', onClearTimer);
    }

    invoke();
  });
}

/**
 * 清理全部轮询
 */
export function clearAllPoll() {
  timers.forEach((value, key) => {
    clearTimeout(Number(value));
    timers.delete(key);
  });
}
