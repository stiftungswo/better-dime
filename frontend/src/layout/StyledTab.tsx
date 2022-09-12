import {TabProps} from '@mui/material';
import Tab from '@mui/material/Tab';
import * as React from 'react';

class StyledTab extends React.Component<TabProps> {
  render() {
    const props = this.props;

    return (
      <Tab
        {...props}
        sx={{
          'padding': '6px 12px',
          'minWidth': '160px',
          '&.Mui-selected': {
            color: 'black',
          },
        }}
      />
    );
  }
}

export default StyledTab;
