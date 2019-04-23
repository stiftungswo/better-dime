import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';
import { ActionButton } from './ActionButton';
import { DeleteIcon } from './icons';

interface ConfirmDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title?: string;
  children: React.ReactNode;
}

export class ConfirmationDialog extends React.Component<ConfirmDialogProps> {
  handleClose = () => {
    this.props.onClose();
  }

  handleOk = () => {
    this.props.onConfirm();
  }

  render() {
    const { children, title, open } = this.props;

    return (
      <Dialog maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={open} onClose={this.handleClose}>
        {title && <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Abbrechen
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

interface DeleteButtonProps {
  onConfirm: () => void;
  message?: string;
  disabled?: boolean;
}

interface DeleteButtonState {
  open: boolean;
}

// tslint:disable
export class DeleteButton extends React.Component<DeleteButtonProps, DeleteButtonState> {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleConfirm = () => {
    this.props.onConfirm();
    this.handleClose();
  }

  render = () => {
    return (
      <>
        <ConfirmationDialog onClose={this.handleClose} onConfirm={this.handleConfirm} open={this.state.open} title={'Löschen'}>
          {this.props.message ? this.props.message : 'Wirklich löschen?'}
        </ConfirmationDialog>
        <ActionButton disabled={this.props.disabled} icon={DeleteIcon} title={'Löschen'} action={this.handleOpen} />
      </>
    );
  }
}
