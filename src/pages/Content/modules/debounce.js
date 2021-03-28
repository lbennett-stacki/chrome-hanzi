export function debounce(callback, duration, options = {}) {
  let timeout = 0;
  let start = 0;
  return (...args) => {
    start = start || Date.now();
    if (timeout) {
      if (options.maxWait && Date.now() - start >= options.maxWait) {
        callback(...args);
        start = 0;
      }
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback(...args);
      clearTimeout(timeout);
    }, duration);

    return timeout;
  };
}
