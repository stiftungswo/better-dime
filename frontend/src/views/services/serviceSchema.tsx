import * as yup from 'yup';
import { localizeSchema, requiredNumber, selector } from '../../utilities/validation';

export const serviceSchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
    description: yup.string().nullable(true),
    vat: requiredNumber(),
    chargeable: yup.boolean(),
    archived: yup.boolean(),
    service_rates: yup.array(
      yup.object({
        id: yup.number(),
        rate_group_id: selector(),
        rate_unit_id: selector(),
        value: requiredNumber(),
      }),
    ),
    local_order: requiredNumber().min(1).max(100),
    order: requiredNumber(),
  }),
);

export const serviceTemplate = {
  id: undefined,
  name: '',
  description: '',
  vat: 0.077,
  chargeable: true,
  archived: false,
  service_rates: [],
  local_order: null, // requre user to set this
  order: null,
};
