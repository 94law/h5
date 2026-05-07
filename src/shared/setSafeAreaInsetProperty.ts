import ResizeObserver from 'resize-observer-polyfill';

export type ObserveProperty = 'top' | 'bottom';

async function setProperty(property: ObserveProperty, value: number) {
  document.documentElement.style.setProperty(`--safe-area-inset-${property}`, `${value}px`);
}

function observeSafeAreaInset(property: ObserveProperty) {
  const detector = document.createElement('div');

  detector.id = `__safe-area-inset-${property}-detector__`;
  detector.style.cssText = `
    position: fixed;
    left: -999%;
    top: -999%;
    height: constant(safe-area-inset-${property});
    height: env(safe-area-inset-${property});
  `;
  document.body.appendChild(detector);

  setProperty(property, detector.clientHeight);

  const observer = new ResizeObserver((entries) => {
    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        setProperty(property, entry.contentRect.height);
      });
    }
  });
  observer.observe(detector);
}

export default function setSafeAreaInsetProperty() {
  const isSupportCSSVariables = !!(
    window.CSS?.supports?.('--a', '0px') || window.CSS?.supports('--a : 0px')
  );

  if (isSupportCSSVariables) {
    (['top', 'bottom'] as ObserveProperty[]).forEach((property) => observeSafeAreaInset(property));
  }
}
