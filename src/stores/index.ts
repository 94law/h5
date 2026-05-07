import { createPinia as createPiniaStore } from 'pinia';
import persist from './plugins/persist';

export default function createPinia() {
  const pinia = createPiniaStore();
  pinia.use(persist);

  return pinia;
}
