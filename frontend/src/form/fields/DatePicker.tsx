import * as React from 'react';
import { DatePicker as MUIDatePicker } from 'material-ui-pickers';
import moment, { Moment } from 'moment';
import { DimeCustomFieldProps } from './common';
import { inject, observer } from 'mobx-react';
import { Formatter } from '../../utilities/formatter';

type ValueType = Moment | string | null | undefined;

const castValue = (value: ValueType) => {
  if (!value) {
    return value;
  }
  if (moment.isMoment(value)) {
    return value;
  } else {
    return moment(value);
  }
};

interface Props extends DimeCustomFieldProps<ValueType, Moment | null> {
  formatter?: Formatter;
  errorMessage?: string;
  onError?: (message: string) => void;
}

@inject('formatter')
@observer
export class DatePicker extends React.Component<Props> {
  render() {
    const { value, onChange, required, formatter, errorMessage, onError, InputComponent, ...rest } = this.props;
    const userDateFormat = formatter!.userDateFormat;
    return (
      <MUIDatePicker
        keyboard
        autoOk
        format={userDateFormat.format}
        mask={userDateFormat.mask}
        placeholder={moment().format(userDateFormat.format)}
        value={castValue(value)}
        onChange={onChange}
        disableOpenOnEnter
        animateYearScrolling={false}
        clearable={!required}
        error={Boolean(errorMessage)}
        helperText={errorMessage}
        onError={(_, message: string) => {
          if (onError) {
            onError(message);
          }
        }}
        {...rest}
      />
    );
  }
}
