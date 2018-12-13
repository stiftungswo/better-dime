import * as Sentry from '@sentry/browser';

// tslint:disable-next-line:no-any
export const empty = (value: any) => {
  if (!value) {
    return true;
  }
  if (value.length === 0) {
    return true;
  }
  return false;
};

export const sum = (arr: number[]) => arr.reduce((a, b) => Number(a) + Number(b), 0);

// tslint:disable-next-line:no-any
export const captureException = (e: any) => Sentry.captureException(e);
