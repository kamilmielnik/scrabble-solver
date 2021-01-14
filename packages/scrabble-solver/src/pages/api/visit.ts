import logger from '@scrabble-solver/logger';
import { NextApiRequest, NextApiResponse } from 'next';

import { getServerLoggingData } from 'api';

const visit = async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const loggingData = getServerLoggingData(request);

  try {
    logger.info('visit', loggingData);
    response.status(200).send(true);
  } catch (error) {
    logger.error(error, loggingData);
    response.status(500).send({
      error: 'Server error',
      message: error.message,
    });
  }
};

export default visit;
