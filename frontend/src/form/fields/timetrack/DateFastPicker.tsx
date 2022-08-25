import Badge from '@mui/material/Badge';
import Button, { ButtonProps } from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import moment, { Moment, unitOfTime } from 'moment';
import * as React from 'react';
import DateMoveButton from '../../../layout/DateMoveButton';
import { BackIcon, ForwardIcon } from '../../../layout/icons';
import { Formatter } from '../../../utilities/formatter';
import { DimeCustomFieldProps, WidthToggle } from '../common';
import { DatePicker, ValueType } from '../DatePicker';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
    },
    button: {
      minWidth: '3rem',
    },
    input: {
      flexGrow: 1,
      margin: `0 ${theme.spacing(0.5)}`,
    },
  });

interface Props extends DimeCustomFieldProps<ValueType, Moment | null>, WidthToggle, WithStyles<typeof styles> {
  formatter?: Formatter;
  errorMessage?: string;
  onError?: (message: string) => void;
  className?: string;
}

class DateFastPickerInner extends React.Component<Props> {
  forwardDay = () => this.change(1, 'day');
  backDay = () => this.change(-1, 'day');
  forwardWeek = () => this.change(1, 'week');
  backWeek = () => this.change(-1, 'week');

  change = (add: number, bounds: unitOfTime.Base) => {
    if (this.props.value) {
      const date = moment.utc(this.props.value)
        .clone()
        .add(add, bounds);

      this.props.onChange(date);
    }
  }

  render() {
    const { classes } = this.props;
    const buttonProps: ButtonProps = {
      className: classes.button,
    };
    return (
      <span className={classes.container}>
        <DateMoveButton
          onClick={this.backWeek}
          buttonProps={buttonProps}
          amount={-7}
        />
        <DateMoveButton
          onClick={this.backDay}
          buttonProps={buttonProps}
          amount={-1}
        />
        <DatePicker className={classes.input} {...this.props} />
        <DateMoveButton
          onClick={this.forwardDay}
          buttonProps={buttonProps}
          amount={1}
        />
        <DateMoveButton
          onClick={this.forwardWeek}
          buttonProps={buttonProps}
          amount={7}
        />
      </span>
    );
  }
}

export const DateFastPicker = withStyles(styles)(DateFastPickerInner);
