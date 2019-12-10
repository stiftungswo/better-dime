import moment from 'moment';
import * as yup from 'yup';
import { apiDateFormat } from '../stores/apiStore';

export const requiredMessage = 'Dies ist ein erforderliches Feld.';

const initializeLocalization = () => {
  return yup.setLocale({
    mixed: {
      required: requiredMessage,
      typeError: requiredMessage,
    },
    number: {
      required: requiredMessage,
      typeError: requiredMessage,
    },
  });
};

/**
 * setLocale changes the global state of yup and the order in which files are evaluated is not predictable. By wrapping
 * the creation of every schema in this function, we make sure setLocale has been called before creating the schema.
 */
export const localizeSchema = <T>(creator: () => yup.Schema<T>) => {
  initializeLocalization();
  return creator();
};

export const titleRegex = () => {
  // allow A-z (with umlaut etc.) and allow - . [ ] ( ) / \
  const allowedStartChars = /[a-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\- *\(\)\.\\/\[\]\:]/gi;
  // allow A-z (with umlaut etc.) and allow - . [ ] ( ) / \
  const allowedMiddleChars = /[a-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\- *\(\)\.\\/\[\]\:\d]/gi;
  return new RegExp('^(( *' + allowedStartChars.source + '+' + allowedMiddleChars.source + '*),){2,3} *\\d{4} *$', 'i');
};

export const nullableNumber = () =>
  yup
    .mixed()
    .transform(value => (value === '' || value === null ? null : Number(value)))
    .nullable(true);

export const dimeDate = () =>
  yup.mixed().transform(value => {
    return value ? moment(value).format(apiDateFormat) : null;
  });

export const requiredNumber = () =>
  yup
    .number()
    .required()
    .typeError(requiredMessage);
export const selector = requiredNumber;

// starting from Dezember 9th we show a warning on projects which contain services with archived rate units
// and ask the user to update the service to a new rate unit
export const isAfterArchivedUnitsCutoff = (createdAt: string) => new Date(createdAt) > new Date('2012-12-09 08:00:00');
