// tslint:disable:max-classes-per-file
import {PropTypes} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import compose from '../utilities/compose';
import { ActionButton } from './ActionButton';
import { DeleteIcon } from './icons';

interface ConfirmDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title?: string;
  intl?: IntlShape;
  children: React.ReactNode;
}

@compose(
  injectIntl,
)
export class ConfirmationDialog extends React.Component<ConfirmDialogProps> {
  handleClose = () => {
    this.props.onClose();
  }

  handleOk = () => {
    this.props.onConfirm();
  }

  render() {
    const { children, title, open } = this.props;
    const intl = this.props.intl!;

    /**  data-expansion-block={true} is so we don't collapse the TimetrackExpansionPanel when we click somewhere */
    return (
      <Dialog data-expansion-block={true} maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={open} onClose={this.handleClose}>
        {title && <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            <FormattedMessage id={'general.action.cancel'} />
          </Button>
          <Button onClick={this.handleOk} color="primary">
            <FormattedMessage id={'general.action.ok'} />
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
  intl?: IntlShape;
}

interface ConfirmationButtonState {
  open: boolean;
}

@compose(
  injectIntl,
)
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
    const intl = this.props.intl!;
    const titleOrDefault = this.props.title || intl.formatMessage({id: 'general.action.delete'});
    return (
      <>
        <ConfirmationDialog onClose={this.handleClose} onConfirm={this.handleConfirm} open={this.state.open} title={titleOrDefault}>
          {this.props.message ? this.props.message : intl.formatMessage({id: 'layout.confirmation_dialog.confirm_delete'})}
        </ConfirmationDialog>
        <ActionButton
          // color={this.props.color}
          // disabled={this.props.disabled}
          {...rest}
          icon={icon || DeleteIcon}
          title={titleOrDefault}
          action={this.handleOpen}
        />
      </>
    );
  }
}
