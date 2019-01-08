import * as yup from 'yup';
import { dimeDate, localizeSchema, requiredNumber } from '../../utilities/validation';

export const holidaySchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
    date: dimeDate().required(),
    duration: requiredNumber(),
  })
);

export const holidayTemplate = {
  name: '',
  date: null,
  duration: 8.4 * 60,
};
