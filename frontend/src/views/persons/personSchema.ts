import * as yup from 'yup';
import { localizeSchema, nullableNumber, requiredNumber, selector } from '../../utilities/validation';

export const personSchema = localizeSchema(() =>
  yup.object({
    archived: yup.boolean(),
    email: yup.string().nullable(true),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    company_id: nullableNumber(),
    rate_group_id: selector(),
    addresses: yup.array(
      yup.object({
        city: yup.string().required(),
        country: yup.string().required(),
        description: yup.string(),
        zip: yup
          .number()
          .required()
          .min(1000, 'Die Postleitzahl muss mindestens vier Stellen umfassen.'),
        street: yup.string().required(),
        supplement: yup.string().nullable(true),
      }),
    ),
    phone_numbers: yup.array(
      yup.object({
        category: requiredNumber(),
        number: yup.string().required(),
      }),
    ),
    tags: yup.array(requiredNumber()),
  }),
);
