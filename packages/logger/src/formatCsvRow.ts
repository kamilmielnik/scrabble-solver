import { type EventValue } from './events';

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export function formatCsvRow(values: EventValue[]): string {
  return `${values.map(formatCsvField).join(',')}\n`;
}

function formatCsvField(value: EventValue): string {
  if (typeof value === 'undefined') {
    return '';
  }

  const text = typeof value === 'string' ? escapeFormula(value) : String(value);
  return needsQuoting(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function escapeFormula(text: string): string {
  return FORMULA_PREFIX.test(text) ? `'${text}` : text;
}

function needsQuoting(text: string): boolean {
  return /[",\n\r]/.test(text) || text !== text.trim();
}
