import * as Sentry from '@sentry/node';
import { throwError } from 'rxjs';

export const captureErrorToSentry = (error: Error) => {
  Sentry.captureException(error);
  return throwError(() => error);
};
