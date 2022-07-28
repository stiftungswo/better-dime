import * as yup from 'yup';
import { localizeSchema } from '../../utilities/validation';

export const serviceCategorySchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
    french_name: yup.string().required(),
    number: yup.number().required().min(1).max(99),
  }),
);

export const serviceCategoryTemplate = {
  order: 9999,
  name: '',
  french_name: '',
  parent: null,
};
