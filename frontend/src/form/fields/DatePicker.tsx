import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { DatePicker as MUIDatePicker, LocalizationProvider } from '@mui/x-date-pickers/';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
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
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <MUIDatePicker
          value={castValue(value)}
          onChange={onChange}
          onError={(_, message: string) => {
            if (onError) {
              onError(message);
            }
          }}
          renderInput={(params) => <TextField {...params} />}
          {...rest}
        />
      </LocalizationProvider >
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
