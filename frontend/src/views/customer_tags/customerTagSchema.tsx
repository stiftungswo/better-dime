import * as yup from 'yup';

export const customerTagSchema = yup.object({
  archived: yup.boolean(),
  name: yup.string().required(),
});
export const customerTagTemplate = {
  archived: false,
  name: '',
};
