import * as yup from 'yup';

export const personSchema = yup.object({
  archived: yup.boolean(),
  email: yup.string().nullable(true),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  company_id: yup.number().nullable(true),
  rate_group_id: yup.number().required(),
  addresses: yup.array(
    yup.object({
      city: yup.string().required(),
      country: yup.string().required(),
      description: yup.string(),
      postcode: yup.number().required(),
      street: yup.string().required(),
      supplement: yup.string().nullable(true),
    })
  ),
  phone_numbers: yup.array(
    yup.object({
      category: yup.number().required(),
      number: yup.string().required(),
    })
  ),
  tags: yup.array(yup.number().nullable(false)),
});
