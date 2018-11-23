import * as yup from 'yup';

export const rateUnitSchema = yup.object({
  archived: yup.boolean(),
  billing_unit: yup.string().required(),
  effort_unit: yup.string().required(),
  factor: yup.number().required(),
  is_time: yup.boolean(),
  name: yup.string().required(),
});

export const rateUnitTemplate = {
  name: '',
  billing_unit: 'CHF /',
  effort_unit: '',
  factor: 1,
  is_time: false,
  archived: false,
};
