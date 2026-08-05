/**
 * Safe Local Storage wrapper to prevent SecurityError / DOMException inside iframe environments.
 * If localStorage is blocked, restricted, or throws an exception, it gracefully falls back to an in-memory dictionary.
 */

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[safeStorage] getItem failed for "${key}". Falling back to in-memory store.`, e);
    }
    return key in memoryStore ? memoryStore[key] : null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`[safeStorage] setItem failed for "${key}". Falling back to in-memory store.`, e);
    }
    memoryStore[key] = value.toString();
  },

  removeItem(key: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`[safeStorage] removeItem failed for "${key}". Falling back to in-memory store.`, e);
    }
    delete memoryStore[key];
  },

  clear(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
        return;
      }
    } catch (e) {
      console.warn('[safeStorage] clear failed. Falling back to in-memory store.', e);
    }
    for (const key in memoryStore) {
      delete memoryStore[key];
    }
  }
};
