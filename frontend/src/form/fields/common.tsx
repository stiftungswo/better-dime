import React, { ReactNode } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input, { InputProps } from '@material-ui/core/Input/Input';
import Switch from '@material-ui/core/Switch/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import { PropTypes } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';

interface SharedProps {
  label?: string;
  name?: string;
  required?: boolean;
}

export interface WidthToggle {
  fullWidth?: boolean;
}

export interface DimeFormControlProps extends SharedProps, WidthToggle {
  margin?: PropTypes.Margin;
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
}

export interface DimeInputFieldProps<T = string> extends DimeFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: T;
}

export interface DimeCustomFieldProps<T, OutputValue = T> extends DimeFieldProps {
  value: T;
  onChange: (value: OutputValue) => void;
}

export const DimeFormControl = (props: DimeFormControlProps) => {
  const { label, children, fullWidth = true, margin = 'normal', required, name, errorMessage } = props;
  return (
    <FormControl margin={margin} error={Boolean(errorMessage)} fullWidth={fullWidth}>
      {label && (
        <InputLabel required={required} htmlFor={name}>
          {label}
        </InputLabel>
      )}
      {children}
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
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

export const NumberField = (props: DimeInputFieldProps) => <DimeInputField type={'number'} {...props} />;

export const PasswordField = (props: DimeInputFieldProps) => <DimeInputField type={'password'} {...props} />;

export const TextField = (props: DimeInputFieldProps) => <DimeInputField type={'text'} {...props} />;
