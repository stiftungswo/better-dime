import * as yup from 'yup';

export const serviceSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  vat: yup.number().required(),
  chargeable: yup.boolean(),
  archived: yup.boolean(),
  service_rates: yup.array(
    yup.object({
      id: yup.number(),
      rate_group_id: yup.number().required(),
      rate_unit_id: yup.number().required(),
      value: yup.number().required(),
    })
  ),
});
export const serviceTemplate = {
  id: undefined,
  name: '',
  description: '',
  vat: 0.077,
  chargeable: true,
  archived: false,
  service_rates: [],
};
