import * as yup from 'yup';
import { dimeDate, nullableNumber } from '../../utilities/validationHelpers';

export const invoiceSchema = yup.object({
  name: yup.string().required(),
  accountant_id: yup.number().required(),
  address_id: yup.number().required(),
  description: yup.string().required(),
  fixed_price: nullableNumber(),
  start: dimeDate().required(),
  end: dimeDate().required(),
  discounts: yup.array(
    yup.object({
      name: yup.string().required(),
      percentage: yup.boolean().required(),
      value: yup.number().required(),
    })
  ),
  positions: yup.array(
    yup.object({
      amount: yup.number().required(),
      description: yup.string().required(),
      order: nullableNumber(),
      price_per_rate: yup.number().required(),
      project_position_id: yup.number().nullable(true),
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
    .min(1),
});

export const invoiceTemplate = {
  id: undefined,
  name: '',
  description: '',
  address_id: '',
  accountant_id: '',
  positions: [],
  discounts: [],
  costgroup_distributions: [],
  start: '',
  end: '',
};
