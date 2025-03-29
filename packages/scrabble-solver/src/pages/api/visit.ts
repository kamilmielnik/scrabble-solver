import { logger } from '@scrabble-solver/logger';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { getServerLoggingData } from 'api';

const visit = (request: NextApiRequest, response: NextApiResponse): void => {
  const meta = getServerLoggingData(request);

  try {
    logger.info('visit - request', { meta });
    response.status(200).send(true);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('visit - error', { error, meta });
    response.status(500).send({ error: 'Server error', message });
  }
};

export default visit;
