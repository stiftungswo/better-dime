import * as yup from 'yup';
import { Employee } from '../../types';
import { dimeDate, localizeSchema, requiredNumber, selector } from '../../utilities/validation';

export const editEmployeeSchema = localizeSchema(() =>
  yup.object({
    archived: yup.boolean(),
    can_login: yup.boolean().required(),
    email: yup.string().email('view.employee.schema.invalid_email').required(),
    holidays_per_year: yup.number().nullable(true),
    is_admin: yup.boolean().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    password: yup.string().min(6, 'view.employee.schema.short_password'),
    password_repeat: yup.string().oneOf([yup.ref('password'), null], 'view.employee.schema.nonmachting_password'),
    locale: yup.string(),
    work_periods: yup.array(
      yup.object({
        ending: dimeDate().required(),
        pensum: requiredNumber(),
        beginning: dimeDate().required(),
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
    email: yup.string().email('view.employee.schema.invalid_email').required(),
    holidays_per_year: yup.number().nullable(true),
    is_admin: yup.boolean().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    first_vacation_takeover: yup.number().required(),
    password: yup.string().required(),
    locale: yup.string().required(),
    password_repeat: yup
      .string()
      .oneOf([yup.ref('password'), null], 'view.employee.schema.nonmachting_password')
      .required(),
    work_periods: yup.array(
      yup.object({
        ending: dimeDate().required(),
        pensum: requiredNumber(),
        beginning: dimeDate().required(),
        vacation_takeover: requiredNumber(),
        yearly_vacation_budget: requiredNumber(),
      }),
    ),
    employee_group_id: selector(),
    addresses: yup.array(
      yup.object({
        city: yup.string().required(),
        country: yup.string().required(),
        description: yup.string(),
        zip: yup
          .number()
          .required()
          .min(1000, 'general.schema.plz_digits'),
        street: yup.string().required(),
        supplement: yup.string().nullable(true),
      }),
    ),
  }),
);

// Form initial state — employee_group_id/group/group_name are null until the user selects a group.
export const employeeTemplate: Omit<Employee, 'employee_group_id' | 'group' | 'group_name'> & { employee_group_id: number | null; group: Employee['group'] | null; group_name: string | null; password?: string } = {
  archived: false,
  email: '',
  can_login: true,
  is_admin: false,
  id: 0,
  first_name: '',
  last_name: '',
  created_at: '',
  updated_at: '',
  holidays_per_year: 20,
  first_vacation_takeover: 0,
  work_periods: [],
  password: '',
  locale: 'de',
  employee_group_id: null,
  group_name: null,
  group: null,
  addresses: [],
};
