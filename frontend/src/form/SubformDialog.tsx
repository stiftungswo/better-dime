import { Formik, FormikBag, FormikConfig, FormikProps } from 'formik';
import * as React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import { LoadingSpinner } from '../layout/DimeLayout';
import { Prompt } from 'react-router';
import { HandleFormikSubmit } from '../types';

interface DialogFormProps<T> {
  title: string;
  onSubmit: (values: T) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export class SubformDialog<Values = object, ExtraProps = {}> extends React.Component<
  FormikConfig<Values> & ExtraProps & DialogFormProps<Values>
> {
  public handleSubmit: HandleFormikSubmit<Values> = async (values, formikBag) => {
    await this.props.onSubmit(values);
    formikBag.setSubmitting(false);
  };

  public handleClose = () => {
    this.props.onClose();
  };

  public render() {
    return this.props.loading ? (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <LoadingSpinner />
      </Dialog>
    ) : (
      <>
        <Dialog open={this.props.open} onClose={this.handleClose}>
          <DialogContent>{this.props.children}</DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>Schliessen</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
