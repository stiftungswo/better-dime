import { createStyles, Theme, WithStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Button, { ButtonProps } from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import moment, { Moment, unitOfTime } from 'moment';
import * as React from 'react';
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
        <Button onClick={this.backWeek} {...buttonProps}>
          <Badge badgeContent={7}>
            <BackIcon />
          </Badge>
        </Button>
        <Button onClick={this.backDay} {...buttonProps}>
          <Badge badgeContent={1}>
            <BackIcon />
          </Badge>
        </Button>
        <DatePicker className={classes.input} {...this.props} />
        <Button onClick={this.forwardDay} {...buttonProps}>
          <Badge badgeContent={1}>
            <ForwardIcon />
          </Badge>
        </Button>
        <Button onClick={this.forwardWeek} {...buttonProps}>
          <Badge badgeContent={7}>
            <ForwardIcon />
          </Badge>
        </Button>
      </span>
    );
  }
}

export const DateFastPicker = withStyles(styles)(DateFastPickerInner);
