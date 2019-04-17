import * as yup from 'yup';
import { localizeSchema } from '../../utilities/validation';

export const customerTagSchema = localizeSchema(() =>
  yup.object({
    archived: yup.boolean(),
    name: yup.string().required(),
  }),
);

export const customerTagTemplate = {
  archived: false,
  name: '',
};
