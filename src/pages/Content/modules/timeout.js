export function timeout(duration) {
  return new Promise((resolve) => setTimeout(() => resolve(), duration));
}
