import { verifyLocally } from '@/solver-worker';
import { type VerifiedWord, type VerifyRequestPayload } from '@/types';

import { fetchJson } from './fetchJson';

interface Response {
  invalidWords: VerifiedWord[];
  validWords: VerifiedWord[];
}

export const verify = async ({ board, game, locale }: VerifyRequestPayload): Promise<Response> => {
  const payload = { board, game, locale };
  return (
    (await verifyLocally(payload)) ??
    fetchJson<Response>('/api/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  );
};
