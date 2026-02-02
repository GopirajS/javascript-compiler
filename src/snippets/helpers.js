// Helper functions for JavaScript Compiler

export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return getType(value) === 'Object';
}

export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function uniqueArray(arr) {
  return [...new Set(arr)];
}

export function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}
