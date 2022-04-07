import * as yup from 'yup';
import { dimeDate, localizeSchema, nullableNumber, requiredNumber, selector, titleRegex } from '../../utilities/validation';

export const projectSchema = localizeSchema(() => {
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
      chargeable: yup.boolean(),
      archived: yup.boolean(),
      deadline: dimeDate().nullable(true),
      rate_group_id: selector(),
      fixed_price: nullableNumber(),
      positions: yup.array(
        yup.object({
          description: yup.string().nullable(true),
          price_per_rate: requiredNumber(),
          rate_unit_id: selector(),
          vat: requiredNumber(),
        }),
      ),
      category_distributions: yup.array(
        yup.object({
          category_id: requiredNumber(),
          weight: requiredNumber().min(1, 'general.schema.category_has_weight'),
        }),
      ).min(1, 'view.project.schema.category_required'),
      costgroup_distributions: yup.array(
        yup.object({
          costgroup_number: requiredNumber(),
          weight: requiredNumber().min(1, 'general.schema.cost_group_has_weight'),
        }),
      )
      .min(1, 'view.project.schema.cost_group_required'),
    });
  },
);

export const projectTemplate = () => ({
  id: undefined,
  name: '',
  description: '',
  deadline: '',
  fixed_price: null,
  position_groupings: [],
  positions: [],
  customer_id: undefined,
  address_id: undefined,
  rate_group_id: undefined,
  costgroup_distributions: [],
  category_distributions: [],
});
