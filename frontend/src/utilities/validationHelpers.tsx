import * as yup from 'yup';
import moment from 'moment';
import { apiDateFormat } from '../stores/apiStore';

export const nullableNumber = () =>
  yup
    .mixed()
    .transform(value => (value === '' || value === null ? null : Number(value)))
    .nullable(true);

export const dimeDate = () =>
  yup.mixed().transform(value => {
    return value ? moment(value).format(apiDateFormat) : null;
  });
