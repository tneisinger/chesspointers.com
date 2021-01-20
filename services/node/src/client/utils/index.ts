export function viewportHeight(): number {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
