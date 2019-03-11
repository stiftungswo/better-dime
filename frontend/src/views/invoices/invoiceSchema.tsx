import * as yup from 'yup';
import { dimeDate, localizeSchema, nullableNumber, requiredNumber, selector } from '../../utilities/validation';

export const invoiceSchema = localizeSchema(() =>
  yup.object({
    name: yup.string().required(),
    accountant_id: selector(),
    address_id: selector(),
    customer_id: selector(),
    description: yup.string().required(),
    fixed_price: nullableNumber(),
    start: dimeDate().required(),
    end: dimeDate().required(),
    discounts: yup.array(
      yup.object({
        name: yup.string().required(),
        percentage: yup.boolean().required(),
        value: requiredNumber(),
      })
    ),
    positions: yup.array(
      yup.object({
        amount: requiredNumber(),
        description: yup.string().required(),
        order: nullableNumber(),
        price_per_rate: requiredNumber(),
        project_position_id: yup.number().nullable(true),
        rate_unit_id: selector(),
        vat: requiredNumber(),
      })
    ),
    costgroup_distributions: yup
      .array(
        yup.object({
          costgroup_number: selector(),
          weight: requiredNumber().min(1, 'Das Gewicht einer Kostenstelle muss grösser als 0 sein.'),
        })
      )
      .min(1, 'Eine Rechnung benötigt mindestens eine zugewiesene Kostenstelle.'),
  })
);

export const invoiceTemplate = {
  id: undefined,
  name: '',
  description: '',
  address_id: '',
  accountant_id: '',
  customer_id: undefined,
  positions: [],
  discounts: [],
  costgroup_distributions: [],
  start: '',
  end: '',
};
