import * as yup from 'yup';
import { dimeDate, localizeSchema, nullableNumber, requiredNumber, selector } from '../../utilities/validation';

export const projectSchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
    accountant_id: selector(),
    address_id: selector(),
    customer_id: selector(),
    description: yup.string().required(),
    chargeable: yup.boolean(),
    archived: yup.boolean(),
    deadline: dimeDate().nullable(true),
    category_id: selector(),
    rate_group_id: selector(),
    fixed_price: nullableNumber(),
    positions: yup.array(
      yup.object({
        description: yup.string().nullable(true),
        price_per_rate: requiredNumber(),
        rate_unit_id: selector(),
        vat: requiredNumber(),
      })
    ),
    costgroup_distributions: yup
      .array(
        yup.object({
          costgroup_number: requiredNumber(),
          weight: requiredNumber().min(1, 'Das Gewicht einer Kostenstelle muss grösser als 0 sein.'),
        })
      )
      .min(1, 'Ein Projekt benötigt mindestens eine zugewiesene Kostenstelle.'),
  })
);

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
