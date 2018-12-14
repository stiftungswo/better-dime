import * as yup from 'yup';
import { dimeDate, nullableNumber } from '../../utilities/validationHelpers';

export const projectSchema = yup.object({
  name: yup.string().required(),
  accountant_id: yup.number().required(),
  address_id: yup.number().required(),
  customer_id: yup.number().required(),
  description: yup.string().required(),
  chargeable: yup.boolean(),
  archived: yup.boolean(),
  deadline: dimeDate().nullable(true),
  category_id: yup.number().required(),
  rate_group_id: yup.number().required(),
  fixed_price: nullableNumber(),
  positions: yup.array(
    yup.object({
      description: yup.string().nullable(true),
      price_per_rate: yup.number().required(),
      rate_unit_id: yup.number().required(),
      vat: yup.number().required(),
    })
  ),
  costgroup_distributions: yup
    .array(
      yup.object({
        costgroup_number: yup.number().required(),
        weight: yup.number().required(),
      })
    )
    .min(1, 'Ein Projekt benötigt mindestens eine zugewiesene Kostenstelle.'),
});

export const projectTemplate = {
  id: undefined,
  name: '',
  description: '',
  deadline: '',
  fixed_price: '',
  positions: [],
  category_id: undefined,
  customer_id: undefined,
  address_id: undefined,
  rate_group_id: undefined,
  costgroup_distributions: [],
};
