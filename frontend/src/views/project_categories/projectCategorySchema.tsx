import * as yup from 'yup';
import { localizeSchema } from '../../utilities/validation';

export const projectCategorySchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
  }),
);

export const projectCategoryTemplate = {
  name: '',
};
