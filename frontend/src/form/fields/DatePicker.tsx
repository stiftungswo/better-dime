import * as React from 'react';
import { ReactNode } from 'react';
import { DatePicker as MUIDatePicker } from 'material-ui-pickers';
import { Moment } from 'moment';
import { FormProps } from './common';
import { getIn } from 'formik';

type MaskFunction = (value: any) => any; //tslint:disable-line:no-any ; Couldn't find any sensible type definitions for this
const mask: MaskFunction = value => (value ? [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/] : []);

export const DatePicker = ({ field, form, required, ...rest }: FormProps & { children: ReactNode }) => {
  const currentError = getIn(form.errors, field.name);
  return (
    <MUIDatePicker
      keyboard
      autoOk
      format="DD.MM.YYYY"
      placeholder="10.10.2018"
      mask={mask}
      value={field.value ? new Date(field.value) : field.value}
      onChange={(date?: Moment) => form.setFieldValue(field.name, date ? date.format('YYYY-MM-DD') : date)}
      disableOpenOnEnter
      animateYearScrolling={false}
      clearable={!required}
      error={!!currentError}
      helperText={currentError}
      onError={(_, error: string) => form.setFieldError(field.name, error)}
      {...rest}
    />
  );
};
