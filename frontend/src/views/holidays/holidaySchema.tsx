import * as yup from 'yup';
import { dimeDate } from '../../utilities/validationHelpers';

export const holidaySchema = yup.object({
  name: yup.string().required(),
  date: dimeDate().required(),
  duration: yup.number().required(),
});
export const holidayTemplate = {
  name: '',
  date: null,
  duration: 8.4 * 60,
};
