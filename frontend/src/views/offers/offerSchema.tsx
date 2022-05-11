import * as yup from 'yup';
import { localizeSchema, nullableNumber, requiredNumber, selector, titleRegex } from '../../utilities/validation';

export const offerSchema = localizeSchema(() => {
    const regex = titleRegex();
    const errorMessage = 'general.schema.title_format';

    return yup.object({
      name: yup.string().matches(regex, regexData => {
        return errorMessage;
      }).required(),
      accountant_id: selector(),
      address_id: selector(),
      customer_id: selector(),
      description: yup.string().required(),
      fixed_price: nullableNumber(),
      fixed_price_vat: nullableNumber(),
      rate_group_id: selector(),
      short_description: yup.string().required(),
      status: selector(),
      discounts: yup.array(
        yup.object({
          name: yup.string().required(),
          percentage: yup.boolean().required(),
          value: requiredNumber(),
        }),
      ),
      positions: yup.array(
        yup.object({
          amount: requiredNumber(),
          description: yup.string().nullable(true),
          order: requiredNumber(),
          price_per_rate: requiredNumber(),
          rate_unit_id: selector(),
          service_id: selector(),
          vat: requiredNumber(),
        }),
      ),
      category_distributions: yup.array(
        yup.object({
          category_id: requiredNumber(),
          weight: requiredNumber().min(1, 'general.schema.category_has_weight'),
        }),
      ).min(1, 'view.offer.schema.category_required'),
      costgroup_distributions: yup.array(
        yup.object({
          costgroup_number: requiredNumber(),
          weight: requiredNumber().min(1, 'general.schema.cost_group_has_weight'),
        }),
      )
      .min(1, 'view.offer.schema.cost_group_required'),
    });
  },
);

export const offerTemplate = () => ({
  id: undefined,
  name: '',
  status: 1,
  short_description: '',
  description: '',
  positions: [],
  position_groupings: [],
  discounts: [],
  fixed_price: null,
  fixed_price_vat: 0,
  customer_id: undefined,
  address_id: undefined,
  rate_group_id: undefined,
});
