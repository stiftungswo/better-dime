import {ButtonProps} from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';

const StyledButton = (props: ButtonProps) =>
  (
    <Button
      {...props}
      sx={{
        color: 'black',
      }}
    />
  );

export default StyledButton;
