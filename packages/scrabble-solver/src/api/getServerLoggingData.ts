import { NextApiRequest } from 'next';

import { ServerLoggingData } from 'types';

const getServerLoggingData = (request: NextApiRequest): ServerLoggingData => ({
  origin: request.headers.origin,
  referer: request.headers.referer,
  userAgent: request.headers['user-agent'],
  xForwardedFor: request.headers['x-forwarded-for'],
  xRealIp: request.headers['x-real-ip'],
});

export default getServerLoggingData;
