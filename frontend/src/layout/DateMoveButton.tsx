import Badge from '@mui/material/Badge';
import {ButtonProps} from '@mui/material/Button';
import * as React from 'react';
import BlackButton from './BlackButton';
import {BackIcon, ForwardIcon} from './icons';

interface Props {
  onClick: () => void;
  buttonProps: ButtonProps;
  amount: number;
}

class DateMoveButton extends React.Component<Props> {
  render() {
    const {onClick, buttonProps, amount} = this.props;

    return (
      <BlackButton onClick={onClick} {...buttonProps}>
        <Badge badgeContent={Math.abs(amount)}>
          {
            amount < 0
              ? <BackIcon/>
              : <ForwardIcon/>
          }
        </Badge>
      </BlackButton>
    );
  }
}

export default DateMoveButton;
