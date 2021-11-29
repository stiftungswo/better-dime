import { createStyles, Theme, WithStyles } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Button, { ButtonProps } from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import moment, { Moment, unitOfTime } from 'moment';
import * as React from 'react';
import { DatePicker } from '../../form/fields/DatePicker';
import { BackIcon, ForwardIcon } from '../../layout/icons';

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
      margin: `0 ${theme.spacing(1 / 2)}px`,
    },
  });

interface Props extends WithStyles<typeof styles> {
  fromValue: Moment;
  toValue: Moment;
  onChangeFrom: (moment: Moment) => void;
  onChangeTo: (moment: Moment) => void;
}

class DateSpanPickerInner extends React.Component<Props> {
  forwardWeek = () => this.change(1, 'week');
  backWeek = () => this.change(-1, 'week');
  forwardMonth = () => this.change(1, 'month');
  backMonth = () => this.change(-1, 'month');

  change = (add: number, bounds: unitOfTime.Base) => {
    const from = this.props.fromValue
      .clone()
      .add(add, bounds)
      .startOf(bounds);
    const to = from.clone().endOf(bounds);
    this.props.onChangeFrom(from);
    this.props.onChangeTo(to);
  }

  current = (bound: unitOfTime.Base) => {
    this.props.onChangeFrom(moment().startOf(bound));
    this.props.onChangeTo(moment().endOf(bound));
  }

  render() {
    const { classes } = this.props;
    const buttonProps: ButtonProps = {
      className: classes.button,
    };
    return (
      <span className={classes.container}>
        <Button onClick={this.backMonth} {...buttonProps}>
          <Badge badgeContent={30}>
            <BackIcon />
          </Badge>
        </Button>
        <Button onClick={this.backWeek} {...buttonProps}>
          <Badge badgeContent={7}>
            <BackIcon />
          </Badge>
        </Button>
        <DatePicker className={classes.input} label={'Von'} value={this.props.fromValue} onChange={this.props.onChangeFrom} />
        <DatePicker className={classes.input} label={'Bis'} value={this.props.toValue} onChange={this.props.onChangeTo} />
        {/*<Button onClick={()=>this.current('week')}{...buttonProps}><Badge badgeContent={7}><NowIcon/></Badge></Button>*/}
        {/*<Button onClick={()=>this.current('month')}{...buttonProps}><Badge badgeContent={30}><NowIcon/></Badge></Button>*/}
        <Button onClick={this.forwardWeek} {...buttonProps}>
          <Badge badgeContent={7}>
            <ForwardIcon />
          </Badge>
        </Button>
        <Button onClick={this.forwardMonth} {...buttonProps}>
          <Badge badgeContent={30}>
            <ForwardIcon />
          </Badge>
        </Button>
      </span>
    );
  }
}

export const DateSpanPicker = withStyles(styles)(DateSpanPickerInner);
