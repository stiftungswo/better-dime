import '@testing-library/jest-dom';
import { resetApiResponses } from './testUtils/mockAxios';

afterEach(resetApiResponses);

// DimeTheme still uses the deprecated adaptV4Theme(); the warning would otherwise be printed by every test file.
const originalWarn = console.warn; // tslint:disable-line:no-console
console.warn = (...args: unknown[]) => { // tslint:disable-line:no-console
  if (typeof args[0] === 'string' && args[0].includes('adaptV4Theme() is deprecated')) {
    return;
  }
  originalWarn(...args);
};
