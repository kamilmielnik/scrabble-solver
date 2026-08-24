import { type EventValue } from './events';

export function formatCsvRow(values: EventValue[]): string {
  return `${values.map(formatCsvField).join(',')}\n`;
}

function formatCsvField(value: EventValue): string {
  if (typeof value === 'undefined') {
    return '';
  }

  const text = String(value);
  return needsQuoting(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function needsQuoting(text: string): boolean {
  return /[",\n\r]/.test(text) || text !== text.trim();
}
