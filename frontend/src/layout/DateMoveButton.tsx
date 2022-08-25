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

const DateMoveButton: React.FC<Props> = ({onClick, buttonProps, amount}) =>
  (
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

export default DateMoveButton;
