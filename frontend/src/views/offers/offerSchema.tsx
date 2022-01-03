import * as yup from 'yup';
import { localizeSchema, nullableNumber, requiredNumber, selector, titleRegex } from '../../utilities/validation';

export const offerSchema = localizeSchema(() => {
    const regex = titleRegex();
    const errorMessage = 'Offertentitel muss folgendes Format haben: Gemeinde, Flurname, Arbeiten, Jahreszahl. Beispiel: \n' +
      'Dübendorf, Chriesbach, Initialpflege, 2019';

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
