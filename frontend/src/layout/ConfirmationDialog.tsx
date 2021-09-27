import {PropTypes} from '@material-ui/core';
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

    /**  data-expansion-block={true} is so we don't collapse the TimetrackExpansionPanel when we click somewhere */
    return (
      <Dialog data-expansion-block={true} maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={open} onClose={this.handleClose}>
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

interface ConfirmationButtonProps {
  onConfirm: () => void;
  message?: string;
  title?: string;
  disabled?: boolean;
  color?: PropTypes.Color;
  icon?: React.ComponentType;
  style?: React.CSSProperties;
}

interface ConfirmationButtonState {
  open: boolean;
}

// tslint:disable
export class ConfirmationButton extends React.Component<ConfirmationButtonProps, ConfirmationButtonState> {
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
    const { icon, title, ...rest } = this.props;
    return (
      <>
        <ConfirmationDialog onClose={this.handleClose} onConfirm={this.handleConfirm} open={this.state.open} title={this.props.title || 'Löschen'}>
          {this.props.message ? this.props.message : 'Wirklich löschen?'}
        </ConfirmationDialog>
        <ActionButton
          // color={this.props.color}
          // disabled={this.props.disabled}
          {...rest}
          icon={icon || DeleteIcon}
          title={title || 'Löschen'}
          action={this.handleOpen} />
      </>
    );
  }
}
