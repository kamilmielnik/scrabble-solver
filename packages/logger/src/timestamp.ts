export function isTimestamp(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && formatTimestamp(date) === value;
}

export function formatTimestamp(date: Date): string {
  return `${date.toISOString().slice(0, 19)}Z`;
}
