import { makeStyles } from '@mui/material/styles';
import { KeyboardDatePicker as MUIDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import { inject, observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import * as React from 'react';
import { Formatter } from '../../utilities/formatter';
import { MomentUtcUtils } from '../../utilities/momentUtcUtils';
import { DimeCustomFieldProps, WidthToggle } from './common';

export type ValueType = Moment | string | null | undefined;

const castValue = (value: ValueType) => {
  if (!value) {
    return value;
  }
  if (moment.isMoment(value)) {
    if (value.isUtc()) {
      return value;
    }
    // DatePicker returns: date at 00:00 UTC+2
    // we want:            date at 00:00 UTC
    return moment.utc(value.format(moment.HTML5_FMT.DATE));
  }
  return moment.utc(value);
};

interface Props extends DimeCustomFieldProps<ValueType, Moment | null>, WidthToggle {
  formatter?: Formatter;
  errorMessage?: string;
  onError?: (message: string) => void;
  className?: string;
}

@inject('formatter')
@observer
export class DatePicker extends React.Component<Props> {
  render() {
    const { value, onChange, required, formatter, errorMessage, onError, fullWidth = true, ...rest } = this.props;
    const userDateFormat = formatter!.userDateFormat;
    return (
    <MuiPickersUtilsProvider utils={MomentUtcUtils} libInstance={moment}>
        <MUIDatePicker
          allowKeyboardControl
          autoOk
          format={userDateFormat.format}
          placeholder={moment().format(userDateFormat.format)}
          value={castValue(value)}
          onChange={onChange}
          animateYearScrolling={false}
          clearable={!required}
          error={Boolean(errorMessage)}
          helperText={errorMessage}
          onError={(_, message: string) => {
            if (onError) {
              onError(message);
            }
          }}
          fullWidth={fullWidth}
          {...rest}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

// Remove date picker button padding.
// Useful in cases where the year would be cut off.
const useStyles = makeStyles({
  // https://stackoverflow.com/questions/60505479/how-to-override-style-of-nested-material-ui-component-from-the-ancestors
  root: {
    '& .MuiIconButton-root': {
      padding: 0,
    },
  },
});

export function DatePickerUnpadded(props: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <DatePicker {...props}/>
    </div>
  );
}
