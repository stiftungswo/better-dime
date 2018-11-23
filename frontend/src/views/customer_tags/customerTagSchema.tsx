import * as yup from 'yup';

export const customerTagSchema = yup.object({
  name: yup.string().required(),
});
export const customerTagTemplate = {
  name: '',
};
