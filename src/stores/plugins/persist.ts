import { get, isPlainObject, set } from 'lodash-es';
import type { PiniaPluginContext, StateTree, SubscriptionCallbackMutation } from 'pinia';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export interface Serializer {
  serialize: (value: StateTree) => string;
  deserialize: (value: string) => StateTree;
}

interface PersistOptions {
  key?: string;
  storage?: StorageLike;
  paths?: string[];
  serializer?: Serializer;
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: boolean | PersistOptions;
  }
}

function makePersistState(state: StateTree, paths?: string[]) {
  if (Array.isArray(paths)) {
    return paths.reduce((acc, cur) => {
      set(acc, cur, get(state, cur));
      return acc;
    }, {});
  }

  return state;
}

export default function persist(context: PiniaPluginContext) {
  const { options, store } = context;

  if (!options.persist) return;

  const {
    storage = localStorage,
    serializer = {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
    key = store.$id,
    paths,
  } = (isPlainObject(options.persist) ? options.persist : {}) as PersistOptions;

  // 恢复之前持久化的状态
  try {
    const persistedState = storage.getItem(key);
    if (persistedState) {
      store.$patch(serializer.deserialize(persistedState));
    }
  } catch {}

  store.$subscribe(
    (_: SubscriptionCallbackMutation<StateTree>, state: StateTree) => {
      // 持久化state变更后的值
      try {
        const persistState = makePersistState(state, paths);
        storage.setItem(key, serializer.serialize(persistState));
      } catch {}
    },
    { detached: true },
  );
}
