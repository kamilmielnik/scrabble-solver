export function readPlaceholders(text: string): string[] {
  return Array.from(text.matchAll(/\{\{(\w+)\}\}/g), ([, name]) => name).sort();
}
