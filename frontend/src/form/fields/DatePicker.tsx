import * as React from 'react';
import { ReactNode } from 'react';
import { DatePicker as MUIDatePicker } from 'material-ui-pickers';
import { Moment } from 'moment';
import { FormProps } from './common';

export const DatePicker = ({ label, field, form, fullWidth = false, children }: FormProps & { children: ReactNode }) => (
  <MUIDatePicker
    keyboard
    autoOk
    fullWidth={fullWidth}
    label={label}
    format="DD.MM.YYYY"
    placeholder="10.10.2018"
    mask={(value: any) => (value ? [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/] : [])}
    value={new Date(field.value)}
    onChange={(date: Moment) => form.setFieldValue(field.name, date.format('YYYY-MM-DD'))}
    disableOpenOnEnter
    animateYearScrolling={false}
  />
);
