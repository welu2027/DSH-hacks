export async function register() {
  // Polyfill localStorage for SSR — some packages try to access it server-side
  if (typeof globalThis.localStorage === "undefined" || typeof globalThis.localStorage?.getItem !== "function") {
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      },
      writable: true,
      configurable: true,
    });
  }
}
