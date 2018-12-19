import * as React from 'react';
import { DatePicker as MUIDatePicker } from 'material-ui-pickers';
import moment, { Moment } from 'moment';
import { FormProps } from './common';
import { getIn } from 'formik';
import { inject, observer } from 'mobx-react';
import { Formatter } from '../../utilities/formatter';

const castValue = (value: Moment | string | null | undefined) => {
  if (!value) {
    return value;
  }
  if (moment.isMoment(value)) {
    return value;
  } else {
    return moment(value);
  }
};

interface Props extends FormProps {
  formatter?: Formatter;
}

@inject('formatter')
@observer
export class DatePicker extends React.Component<Props> {
  render() {
    const { field, form, required, formatter, ...rest } = this.props;
    const userDateFormat = formatter!.userDateFormat;
    const currentError = getIn(form.errors, field.name);
    return (
      <MUIDatePicker
        keyboard
        autoOk
        format={userDateFormat.format}
        mask={userDateFormat.mask}
        placeholder={moment().format(userDateFormat.format)}
        value={castValue(field.value)}
        onChange={(date?: Moment) => form.setFieldValue(field.name, date)}
        disableOpenOnEnter
        animateYearScrolling={false}
        clearable={!required}
        error={!!currentError}
        helperText={currentError}
        onError={(_, error: string) => form.setFieldError(field.name, error)}
        {...rest}
      />
    );
  }
}
