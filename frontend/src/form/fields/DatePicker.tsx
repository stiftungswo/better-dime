import * as React from 'react';
import { ReactNode } from 'react';
import { DatePicker as MUIDatePicker } from 'material-ui-pickers';
import { Moment } from 'moment';
import { FormProps } from './common';

//TODO: Display validation errors https://github.com/dmtrKovalenko/material-ui-pickers/issues/761
export const DatePicker = ({ field, form, required, ...rest }: FormProps & { children: ReactNode }) => (
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
    {...rest}
  />
);
