import * as React from 'react';
import { ReactNode } from 'react';
import { DatePicker as MUIDatePicker } from 'material-ui-pickers';
import { Moment } from 'moment';
import { FormProps } from './common';
import { getIn } from 'formik';

export const DatePicker = ({ field, form, required, ...rest }: FormProps & { children: ReactNode }) => {
  const currentError = getIn(form.errors, field.name);
  return (
    <MUIDatePicker
      keyboard
      autoOk
      format="DD.MM.YYYY"
      placeholder="10.10.2018"
      mask={(value: any) => (value ? [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/] : [])}
      value={field.value ? new Date(field.value) : field.value}
      onChange={(date?: Moment) => form.setFieldValue(field.name, date ? date.format('YYYY-MM-DD') : date)}
      disableOpenOnEnter
      animateYearScrolling={false}
      clearable={!required}
      error={!!currentError}
      helperText={currentError}
      onError={(_, error: any) => form.setFieldError(field.name, error)}
      {...rest}
    />
  );
};
