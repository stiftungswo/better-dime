import * as yup from 'yup';

export const projectCategorySchema = yup.object({
  name: yup.string().required(),
});
export const projectCategoryTemplate = {
  name: '',
};
