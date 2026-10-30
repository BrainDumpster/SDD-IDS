/** Join truthy class name parts. Port of `lib/react/shared/utils/cx.ts`. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
