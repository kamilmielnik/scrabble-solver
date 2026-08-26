import { type VisitRequestPayload } from '@/types';

import { fetchJson } from './fetchJson';

export function visit(payload: VisitRequestPayload): Promise<boolean> {
  return fetchJson<boolean>('/api/visit', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
