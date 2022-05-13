import * as yup from 'yup';
import { localizeSchema } from '../../utilities/validation';

export const locationSchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
    url: yup.string(),
  }),
);

export const locationTemplate = {
  archived: false,
  name: '',
  url: '',
};
