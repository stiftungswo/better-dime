import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Input, { InputProps } from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import React, { ReactNode } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import {TransformingField, TransformingFieldProps} from './TransformingField';

interface SharedProps {
  label?: string;
  name?: string;
  required?: boolean;
}

export interface WidthToggle {
  fullWidth?: boolean;
}

export interface DimeFormControlProps extends SharedProps, WidthToggle {
  margin?: 'dense' | 'none' | 'normal';
  children: ReactNode;
  errorMessage?: string;
}

interface FormikInjectableProps {
  InputComponent?: React.ComponentType<InputProps>;
  errorMessage?: string;
}

interface DimeFieldProps extends SharedProps, FormikInjectableProps {
  type?: string;
  unit?: string;
  disabled?: boolean;
  multiline?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface DimeInputFieldProps<T = string> extends DimeFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: T;
  className?: any;
}

export interface DimeCustomFieldProps<T, OutputValue = T> extends DimeFieldProps {
  value: T;
  onChange: (value: OutputValue) => void;
}
// If errorMessage is an identifier like view.project.schema.cost_group_required,
// use intl, otherwise just display the errorMessage.
export const possiblyIntlError = (intl: IntlShape, errorMessage: string) => {
  if (!(errorMessage && errorMessage.charAt)) { // ensure errorMessage is a string
    return '';
  }
  return errorMessage.includes('schema.') ? intl.formatMessage({id: errorMessage}) : errorMessage;

};

export const DimeFormControl = (props: DimeFormControlProps) => {
  const { label, children, fullWidth = true, margin = 'normal', required, name, errorMessage } = props;
  const intl = useIntl();
  return (
    <FormControl
      variant="standard"
      margin={margin}
      error={Boolean(errorMessage)}
      fullWidth={fullWidth}
    >
      {label && (
        <InputLabel required={required} htmlFor={name}>
          {label}
        </InputLabel>
      )}
      {children}
      {errorMessage && <FormHelperText error>{possiblyIntlError(intl, errorMessage)}</FormHelperText>}
    </FormControl>
  );
};

export const DimeInputField = (props: DimeInputFieldProps & Partial<DimeFormControlProps>) => {
  const { label, unit, margin, required, value, InputComponent = Input, errorMessage, fullWidth = true, ...rest } = props;
  return (
    <DimeFormControl label={label} fullWidth={fullWidth} margin={margin} required={required} name={rest.name} errorMessage={errorMessage}>
      <InputComponent
        endAdornment={unit ? <InputAdornment position={'end'}>{unit}</InputAdornment> : undefined}
        value={value === null ? '' : value}
        fullWidth={fullWidth}
        {...rest}
      />
    </DimeFormControl>
  );
};

export const SwitchField = ({ label, value, onChange }: DimeInputFieldProps<boolean>) => (
  <FormControlLabel control={<Switch checked={value} onChange={onChange} />} label={label} />
);

export const EmailField = (props: DimeInputFieldProps) => <DimeInputField type={'email'} {...props} />;

const toString = (n: number) => String(n);
const toNumber = (s: string) => Number(s);
export const NumberField = (props: TransformingFieldProps<number>) => (
  <TransformingField<number> {...props} toString={toString} toValue={toNumber} type={'number'} {...props} />
);

export const PasswordField = (props: DimeInputFieldProps) => <DimeInputField type={'password'} {...props} />;

export const TextField = (props: DimeInputFieldProps) => <DimeInputField type={'text'} {...props} />;
