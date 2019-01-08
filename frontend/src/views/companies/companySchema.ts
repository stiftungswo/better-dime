import * as yup from 'yup';
import { localizeSchema, selector } from '../../utilities/validation';

export const companySchema = localizeSchema(() =>
  yup.object({
    archived: yup.boolean(),
    email: yup.string().nullable(true),
    name: yup.string().required(),
    company_id: yup.number().nullable(true),
    rate_group_id: selector(),
    addresses: yup.array(
      yup.object({
        city: yup.string().required(),
        country: yup.string().nullable(true),
        description: yup.string().nullable(true),
        postcode: yup
          .number()
          .required()
          .min(1000, 'Die Postleitzahl muss mindestens vier Stellen umfassen.'),
        street: yup.string().required(),
        supplement: yup.string().nullable(true),
      })
    ),
    phone_numbers: yup.array(
      yup.object({
        category: selector(),
        number: yup.string().required(),
      })
    ),
    tags: yup.array(yup.number().nullable(false)),
  })
);
