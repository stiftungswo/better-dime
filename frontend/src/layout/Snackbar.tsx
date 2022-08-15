import { IconButton, Theme } from '@mui/material';
import { green } from '@mui/material/colors';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { createStyles, withStyles, WithStyles } from '@mui/material/styles';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Notifier } from '../utilities/notifier';
import { CloseIcon } from './icons';

const styles = createStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {},
}));

export type Variant = 'success' | 'error' | 'info';

interface Props extends WithStyles<typeof styles> {
  notifier?: Notifier;
}
@inject('notifier')
@observer
class DimeSnackbarInner extends React.Component<Props> {
  render() {
    const notifier = this.props.notifier!;
    const messageInfo = notifier.messageInfo;

    return (
      <Snackbar
        key={notifier.messageInfo.key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={notifier.open}
        autoHideDuration={messageInfo.autoHideDuration as any} // tslint:disable-line:no-any ; null is valid according to docs
        onClose={notifier.handleClose}
        TransitionProps={{onExited: notifier.handleExited}}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
      >
        <SnackbarContent
          className={this.props.classes[messageInfo.variant]}
          message={<span id="message-id">{messageInfo.message}</span>}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={notifier.handleClose}>
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

export const DimeSnackbar = withStyles(styles)(DimeSnackbarInner);
