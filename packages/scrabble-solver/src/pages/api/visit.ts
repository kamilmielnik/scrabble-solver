import logger from '@scrabble-solver/logger';
import { NextApiRequest, NextApiResponse } from 'next';

const visit = async (_request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    logRequest();
    response.status(200).send(true);
  } catch (error) {
    logger.error(error);
    response.status(500).send({
      error: 'Server error',
      message: error.message,
    });
  }
};

const logRequest = () => {
  logger.info('visit');
};

export default visit;
