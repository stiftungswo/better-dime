import {TabProps} from '@mui/material';
import Tab from '@mui/material/Tab';
import * as React from 'react';

const StyledTab = (props: TabProps) =>
  (
    <Tab
      {...props}
      sx={{
        '&.Mui-selected': {
          color: 'black',
        },
      }}
    />
  );

export default StyledTab;
