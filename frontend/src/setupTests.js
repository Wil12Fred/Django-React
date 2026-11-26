// Jest 20's jsdom has no localStorage; the auth actions need one.
class MemoryStorage {
  constructor() { this.items = {}; }
  get length() { return Object.keys(this.items).length; }
  getItem(key) { return key in this.items ? this.items[key] : null; }
  setItem(key, value) { this.items[key] = String(value); }
  removeItem(key) { delete this.items[key]; }
  clear() { this.items = {}; }
}

if (!global.localStorage) {
  Object.defineProperty(global, "localStorage", { value: new MemoryStorage() });
}
