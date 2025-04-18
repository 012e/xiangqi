import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingState = {
  backendUrl: string;
};

type SettingActions = {
  actions: {
    setBackendUrl: (url: string) => void;
  };
};

function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function merge(target: any, source: any): any {
  if (Array.isArray(source)) {
    return source.slice();
  }

  if (isObject(source)) {
    const result = { ...target };
    for (const key in source) {
      if (isObject(source[key]) && isObject(target?.[key])) {
        result[key] = merge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  return source;
}


export type SettingStore = SettingState & SettingActions;

const BACKEND_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://xiangqi-backend-e4f524a5a2ad.herokuapp.com';

const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      backendUrl: BACKEND_URL,
      actions: {
        setBackendUrl(url): void {
          set({ backendUrl: url });
        },
      },
    }),
    {
      name: 'setting-storage',
      version: 1,
      merge: (persistedState, currentState) => {
        // add this part
        return merge(currentState, persistedState);
      },
    },
  ),
);

// Exported getter and setter
export const useBackendUrl = () => useSettingStore((state) => state.backendUrl);

export const useSettingActions = () =>
  useSettingStore((state) => state.actions);

export default useSettingStore;
