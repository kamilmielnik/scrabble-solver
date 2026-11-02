export function isKeyboardFocused(target: EventTarget): boolean {
  return target instanceof Element && target.matches(':focus-visible');
}
