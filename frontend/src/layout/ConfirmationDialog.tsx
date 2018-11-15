import * as React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import { Fragment } from 'react';
import { ActionButton } from './ActionButton';

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
  };

  handleOk = () => {
    this.props.onConfirm();
  };

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
}

interface DeleteButtonState {
  open: boolean;
}

export class DeleteButton extends React.Component<DeleteButtonProps, DeleteButtonState> {
  public state = {
    open: false,
  };

  public handleOpen = () => {
    this.setState({ open: true });
  };

  public handleClose = () => {
    this.setState({ open: false });
  };

  public handleConfirm = () => {
    this.props.onConfirm();
    this.handleClose();
  };

  public render = () => {
    return (
      <Fragment>
        <ConfirmationDialog onClose={this.handleClose} onConfirm={this.handleConfirm} open={this.state.open} title={'Löschen'}>
          { this.props.message ? this.props.message  : "Wirklich löschen?" }
        </ConfirmationDialog>
        <ActionButton icon={DeleteIcon} title={'Löschen'} action={this.handleOpen} />
      </Fragment>
    );
  };
}
