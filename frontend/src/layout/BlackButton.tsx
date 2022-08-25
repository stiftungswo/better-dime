import {ButtonProps} from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';

const BlackButton = (props: ButtonProps) =>
  (
    <Button
      {...props}
      sx={{
        color: 'black',
      }}
    />
  );

export default BlackButton;
