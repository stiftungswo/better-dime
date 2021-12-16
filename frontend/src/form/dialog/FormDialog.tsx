import {DialogTitle} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Formik, FormikBag, FormikConfig, FormikProps } from 'formik';
import * as React from 'react';
import { Prompt } from 'react-router';
import { Schema } from 'yup';
import { LoadingSpinner } from '../../layout/LoadingSpinner';
import { HandleFormikSubmit } from '../../types';
import compose from '../../utilities/compose';
import { withFullScreen } from '../../utilities/withFullScreen';
import { FormikSubmitDetector } from '../FormikSubmitDetector';

interface DialogFormProps<T> {
  title: string;
  onSubmit: (values: T) => Promise<void>;
  validationSchema: Schema<T>;
  render: (props: FormikProps<T>, id: number) => React.ReactNode;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  confirmText?: string;
  fullScreen?: boolean;
}

@compose(
  withFullScreen,
)
export class FormDialog<Values = object, ExtraProps = {}> extends React.Component<
  FormikConfig<Values> & ExtraProps & DialogFormProps<Values>
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
    const { fullScreen, ...rest } = this.props as any;

    return this.props.loading ? (
      <Dialog open={this.props.open} onClose={this.props.onClose} fullScreen={fullScreen!}>
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
            <Dialog open={this.props.open} onClose={this.handleClose(formikProps)} fullScreen={fullScreen!} maxWidth="lg">
              <DialogTitle>{this.props.title}</DialogTitle>
              <DialogContent style={{minWidth: '300px'}}>{this.props.render(formikProps)}</DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose(formikProps)}>Abbruch</Button>
                <Button onClick={formikProps.submitForm} disabled={formikProps.isSubmitting}>
                  {this.props.confirmText || 'Speichern'}
                </Button>
              </DialogActions>
            </Dialog>
          </FormikSubmitDetector>
        )}
      />
    );
  }
}
