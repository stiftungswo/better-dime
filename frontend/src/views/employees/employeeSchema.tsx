import * as yup from 'yup';

export const editEmployeeSchema = yup.object({
  archived: yup.boolean(),
  can_login: yup.boolean().required(),
  email: yup.string().required(),
  holidays_per_year: yup.number().nullable(true),
  is_admin: yup.boolean().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  password: yup.string(),
  password_repeat: yup.string().oneOf([yup.ref('password'), null], 'Passwort muss mit neuem Passwort übereinstimmen.'),
});

export const newEmployeeSchema = yup.object({
  archived: yup.boolean(),
  can_login: yup.boolean().required(),
  email: yup.string().required(),
  holidays_per_year: yup.number().nullable(true),
  is_admin: yup.boolean().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  password: yup.string().required(),
  password_repeat: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwort muss mit neuem Passwort übereinstimmen.')
    .required(),
});

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
  workingPeriods: [],
  password: '',
};
