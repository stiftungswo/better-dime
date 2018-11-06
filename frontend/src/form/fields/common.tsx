import * as React from 'react';
import { ReactNode } from 'react';
import { ErrorMessage, FieldProps } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input/Input';
import Switch from '@material-ui/core/Switch/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';

export type InputFieldProps = { type: string; unit?: string } & FormProps;
export type FormProps = { label: string; children: JSX.Element; fullWidth: boolean } & FieldProps;

export const ValidatedFormGroupWithLabel = ({ label, field, form: { touched, errors }, children, fullWidth }: FormProps) => {
  const hasErrors: boolean = !!errors[field.name] && !!touched[field.name];

  return (
    <FormControl margin={'normal'} error={hasErrors} fullWidth={fullWidth}>
      {label && <InputLabel htmlFor={field.name}>{label}</InputLabel>}
      {children}
      <ErrorMessage name={field.name} render={error => <FormHelperText error={true}>{error}</FormHelperText>} />
    </FormControl>
  );
};

export const FieldWithValidation = ({ label, field, type = 'text', form, fullWidth = false }: FormProps & { type: string }) => {
  return (
    <ValidatedFormGroupWithLabel label={label} field={field} form={form} fullWidth={fullWidth}>
      <input {...field} type={type} />
    </ValidatedFormGroupWithLabel>
  );
};

export const SwitchField = ({ label, field }: FormProps) => (
  <FormControlLabel control={<Switch checked={field.value} {...field} />} label={label} />
);

export const InputFieldWithValidation = ({
  label,
  field,
  form,
  fullWidth = false,
  type = 'text',
  unit = undefined,
  ...rest
}: InputFieldProps) => (
  <ValidatedFormGroupWithLabel label={label} field={field} form={form} fullWidth={fullWidth}>
    <Input
      id={field.name}
      name={field.name}
      type={type}
      fullWidth={fullWidth}
      endAdornment={unit ? <InputAdornment position={'end'}>{unit}</InputAdornment> : undefined}
      {...field}
      {...rest}
    />
  </ValidatedFormGroupWithLabel>
);

export const EmailFieldWithValidation = ({ label, field, form, fullWidth = false, children }: FormProps & { children: ReactNode }) => (
  <InputFieldWithValidation type={'email'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} />
);

export const NumberFieldWithValidation = ({
  label,
  field,
  form,
  fullWidth = false,
  children,
  unit = undefined,
}: FormProps & { children: ReactNode; unit?: string }) => (
  <InputFieldWithValidation type={'number'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} unit={unit} />
);

export const PasswordFieldWithValidation = ({ label, field, form, fullWidth = false, children }: FormProps & { children: ReactNode }) => (
  <InputFieldWithValidation type={'password'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} />
);

export const TextFieldWithValidation = ({
  label,
  field,
  form,
  fullWidth = false,
  children,
  ...rest
}: FormProps & { children: ReactNode; multiline: boolean }) => (
  <InputFieldWithValidation type={'text'} label={label} fullWidth={fullWidth} field={field} form={form} children={children} {...rest} />
);

export const TodoField = ({ label, field, form, fullWidth = false, type = 'text', unit = undefined }: InputFieldProps) => {
  console.warn('TodoField used! Implement a custom field type for this.');
  return (
    <ValidatedFormGroupWithLabel label={`[TODO] ${label || ''}`} field={field} form={form} fullWidth={fullWidth}>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        fullWidth={fullWidth}
        endAdornment={unit ? <InputAdornment position={'end'}>{unit}</InputAdornment> : undefined}
        {...field}
      />
    </ValidatedFormGroupWithLabel>
  );
};
