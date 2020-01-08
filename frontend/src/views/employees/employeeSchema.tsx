import * as yup from 'yup';
import { dimeDate, localizeSchema, requiredNumber, selector } from '../../utilities/validation';

export const editEmployeeSchema = localizeSchema(() =>
  yup.object({
    archived: yup.boolean(),
    can_login: yup.boolean().required(),
    email: yup.string().required(),
    holidays_per_year: yup.number().nullable(true),
    is_admin: yup.boolean().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    password: yup.string(),
    password_repeat: yup.string().oneOf([yup.ref('password'), null], 'Passwort muss mit neuem Passwort übereinstimmen.'),
    work_periods: yup.array(
      yup.object({
        end: dimeDate().required(),
        pensum: requiredNumber(),
        start: dimeDate().required(),
        vacation_takeover: requiredNumber(),
        yearly_vacation_budget: requiredNumber(),
        overlapping_periods: yup.boolean().default(false),
      }),
    ),
    employee_group_id: selector(),
  }),
);

export const newEmployeeSchema = localizeSchema(() =>
  yup.object({
    archived: yup.boolean(),
    can_login: yup.boolean().required(),
    email: yup.string().required(),
    holidays_per_year: yup.number().nullable(true),
    is_admin: yup.boolean().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    first_vacation_takeover: yup.number().required(),
    password: yup.string().required(),
    password_repeat: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwort muss mit neuem Passwort übereinstimmen.')
      .required(),
    work_periods: yup.array(
      yup.object({
        end: dimeDate().required(),
        pensum: requiredNumber(),
        start: dimeDate().required(),
        vacation_takeover: requiredNumber(),
        yearly_vacation_budget: requiredNumber(),
      }),
    ),
    employee_group_id: selector(),
  }),
);

export const employeeTemplate = {
  archived: false,
  email: '',
  can_login: true,
  is_admin: false,
  id: 0,
  first_name: '',
  last_name: '',
  createdAt: '',
  updatedAt: '',
  holidays_per_year: 20,
  realTime: 0,
  targetTime: 0,
  extendTimetrack: false,
  first_vacation_takeover: 0.0,
  work_periods: [],
  password: '',
  employee_group_id: 0,
};
