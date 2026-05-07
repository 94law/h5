const ABTestKey = '__ABTEST__';
let value = window.localStorage.getItem(ABTestKey);

export default function getABTestKey() {
  if (!value) {
    try {
      value = String(window.crypto.getRandomValues(new Uint32Array(1))[0]);
    } catch {
      value = String(Math.floor(Math.random() * (1e10 - 1 - 1e9) + 1e9));
    }

    window.localStorage.setItem(ABTestKey, value);
  }

  return value;
}
