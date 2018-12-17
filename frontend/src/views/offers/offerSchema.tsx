import * as yup from 'yup';
import { nullableNumber } from '../../utilities/validationHelpers';

export const offerSchema = yup.object({
  name: yup.string().required(),
  accountant_id: yup.number().required(),
  address_id: yup.number().required(),
  customer_id: yup.number().required(),
  description: yup.string().required(),
  fixed_price: nullableNumber(),
  rate_group_id: yup.number().required(),
  short_description: yup.string().required(),
  status: yup.number().required(),
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
      description: yup.string().nullable(true),
      order: yup.number().required(),
      price_per_rate: yup.number().required(),
      rate_unit_id: yup.number().required(),
      service_id: yup.number().required(),
      vat: yup.number().required(),
    })
  ),
});

export const offerTemplate = {
  id: undefined,
  name: '',
  status: 1,
  short_description: '',
  description: '',
  positions: [],
  discounts: [],
  customer_id: undefined,
  address_id: undefined,
  rate_group_id: undefined,
};
