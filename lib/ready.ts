"use client";

/**
 * Tiny signal for "the brand loader has finished".
 * Animations that should play in view (like the hero intro) wait on it instead of running underneath the loader.
 */
let ready = false;
const listeners = new Set<() => void>();

export function markAppReady() {
  if (ready) return;
  ready = true;
  for (const fn of listeners) fn();
  listeners.clear();
}

export function onAppReady(fn: () => void): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
