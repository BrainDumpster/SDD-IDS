import type { MutableRefObject, Ref } from "react";

/** Merge multiple React refs into a single callback ref. */
export function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): (value: T | null) => void {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as MutableRefObject<T | null>).current = value;
      }
    }
  };
}
