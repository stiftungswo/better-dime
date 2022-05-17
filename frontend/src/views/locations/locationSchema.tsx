import * as yup from 'yup';
import { localizeSchema } from '../../utilities/validation';

export const locationSchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
    url: yup.string(),
    order: yup.number().required(),
  }),
);

export const locationTemplate = {
  archived: false,
  order: 9999,
  name: '',
  url: '',
};
