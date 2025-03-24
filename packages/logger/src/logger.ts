import path from 'path';
import { createLogger, format, transports } from 'winston';

import { OUTPUT_DIRECTORY } from './constants';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.prettyPrint(),
  ),
  transports: [
    new transports.File({
      filename: path.resolve(OUTPUT_DIRECTORY, 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.resolve(OUTPUT_DIRECTORY, 'all.log'),
    }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      level: 'error',
    }),
  ],
});
