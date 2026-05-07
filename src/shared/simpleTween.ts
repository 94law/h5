import BezierEasing from 'bezier-easing';

export interface SimpleTweenOptions {
  start?: number;
  end?: number;
  duration?: number;
  onUpdate?: (v: number) => void;
  onComplete?: () => void;
  easing?: BezierEasing.EasingFunction;
}

export type TweenCanceler = () => void;

/**
 * 补间动画
 */
export default function simpleTween(options?: SimpleTweenOptions): TweenCanceler {
  const {
    start = 0,
    end = 1,
    duration = 4000,
    onUpdate,
    onComplete,
    /** See {@link https://www.w3.org/TR/css-easing-1/#valdef-cubic-bezier-easing-function-ease} */
    easing = BezierEasing(0.25, 0.1, 0.25, 1),
  } = options ?? {};
  const startTime = Date.now();
  let raf: number | undefined;

  const tick = () => {
    raf = requestAnimationFrame(() => {
      const step = (Date.now() - startTime) / duration;
      const eased = step > 1 ? 1 : easing(step);
      const now = (end - start) * eased + start;

      if (typeof onUpdate === 'function') {
        onUpdate(now);
      }

      if (eased < 1) {
        tick();
      } else {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    });
  };

  tick();

  return () => {
    if (raf != null) {
      cancelAnimationFrame(raf);
    }
  };
}
