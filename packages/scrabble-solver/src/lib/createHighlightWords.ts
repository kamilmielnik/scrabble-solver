import { createRegExp } from '@/lib/createRegExp';

export function createHighlightWords(query: string): RegExp[] {
  if (query.trim().length === 0) {
    return [];
  }

  return [createRegExp(query)];
}
