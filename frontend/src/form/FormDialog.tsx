import {DialogTitle, withMobileDialog} from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import { InjectedProps } from '@material-ui/core/withMobileDialog';
import { Formik, FormikBag, FormikConfig, FormikProps } from 'formik';
import * as React from 'react';
import { Prompt } from 'react-router';
import { Schema } from 'yup';
import { LoadingSpinner } from '../layout/LoadingSpinner';
import { HandleFormikSubmit } from '../types';
import compose from '../utilities/compose';
import { FormikSubmitDetector } from './FormikSubmitDetector';

interface DialogFormProps<T> {
  title: string;
  onSubmit: (values: T) => Promise<void>;
  validationSchema?: Schema<T>;
  render: (props: FormikProps<T>, id: number) => React.ReactNode;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

@compose(withMobileDialog())
export class FormDialog<Values = object, ExtraProps = {}> extends React.Component<
  FormikConfig<Values> & ExtraProps & DialogFormProps<Values> & InjectedProps
> {
  handleSubmit: HandleFormikSubmit<Values> = async (values, formikBag) => {
    await this.props.onSubmit(this.props.validationSchema.cast(values));
    formikBag.setSubmitting(false);
  }

  handleClose = (props: FormikProps<Values>) => () => {
    if (props.dirty) {
      if (confirm('Die Änderungen wurden noch nicht gespeichert. Verwerfen?')) {
        this.props.onClose();
      }
    } else {
      this.props.onClose();
    }
  }

  render() {
    // tslint:disable-next-line:no-any ; need this so we can spread into ...rest
    const { fullScreen, ...rest } = this.props as any;

    return this.props.loading ? (
      <Dialog open={this.props.open} onClose={this.props.onClose} fullScreen={fullScreen}>
        <LoadingSpinner />
      </Dialog>
    ) : (
      <Formik
        {...rest}
        onSubmit={this.handleSubmit}
        isInitialValid={true}
        render={(formikProps: FormikProps<Values>) => (
          <FormikSubmitDetector {...formikProps}>
            <Prompt when={formikProps.dirty} message={() => 'Die Änderungen wurden noch nicht gespeichert. Verwerfen?'} />
            <Dialog open={this.props.open} onClose={this.handleClose(formikProps)} fullScreen={fullScreen} maxWidth="lg">
              <DialogTitle>{this.props.title}</DialogTitle>
              <DialogContent style={{minWidth: '300px'}}>{this.props.render(formikProps)}</DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose(formikProps)}>Abbruch</Button>
                <Button onClick={formikProps.submitForm} disabled={formikProps.isSubmitting}>
                  Speichern
                </Button>
              </DialogActions>
            </Dialog>
          </FormikSubmitDetector>
        )}
      />
    );
  }
}
