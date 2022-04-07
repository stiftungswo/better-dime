import moment from 'moment';
import * as yup from 'yup';
import { apiDateFormat } from '../stores/apiStore';

export const requiredMessage = 'validation.schema.field_required';

const initializeLocalization = () => {
  return yup.setLocale({
    mixed: {
      required: requiredMessage,
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
  // allow A-z (with umlaut etc.) and allow - . [ ] ( ) / \, also allow digits
  const allowedMiddleChars = /[a-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\- *\(\)\.\\/\[\]\:\d]/gi;
  // require pattern Gemeinde, Flurname, Arbeiten, Jahr or Gemeinde, Arbeiten, Jahr
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

// starting from Dezember 14th we show a warning on projects which contain services with archived rate units
// and ask the user to update the service to a new rate unit
export const isAfterArchivedUnitsCutoff = (createdAt: string) => new Date(createdAt) > new Date('2019-12-14 08:00:00');
