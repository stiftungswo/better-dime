import {TabProps} from '@mui/material';
import Tab from '@mui/material/Tab';
import * as React from 'react';

const StyledTab = (props: TabProps) =>
  (
    <Tab
      {...props}
      sx={{
        'padding': '6px 12px',
        'min-width': '160px',
        '&.Mui-selected': {
          color: 'black',
        },
      }}
    />
  );

export default StyledTab;
