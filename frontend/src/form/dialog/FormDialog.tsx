import {DialogTitle} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Formik, FormikConfig, FormikProps } from 'formik';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Prompt } from 'react-router';
import { Schema } from 'yup';
import BlackButton from '../../layout/BlackButton';
import { LoadingSpinner } from '../../layout/LoadingSpinner';
import { HandleFormikSubmit } from '../../types';
import compose from '../../utilities/compose';
import { withFullScreen } from '../../utilities/withFullScreen';
import { wrapIntl } from '../../utilities/wrapIntl';
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
  intl?: IntlShape;
}

@compose(
  injectIntl,
  withFullScreen,
)
export class FormDialog<Values = object, ExtraProps = {}> extends React.Component<
  FormikConfig<Values> & ExtraProps & DialogFormProps<Values>
> {
  handleSubmit: HandleFormikSubmit<Values> = async (values, formikBag) => {
    await this.props.onSubmit(this.props.validationSchema.cast(values));
    formikBag.setSubmitting(false);
  }

  handleClose = (props: FormikProps<Values>, confirmText: string) => () => {
    if (props.dirty) {
      if (confirm(confirmText)) {
        this.props.onClose();
      }
    } else {
      this.props.onClose();
    }
  }

  render() {
    const { fullScreen, render, ...rest } = this.props as any;
    const intlText = wrapIntl(this.props.intl!, 'form.dialog.form');

    return this.props.loading ? (
      <Dialog open={this.props.open} onClose={this.props.onClose} fullScreen={fullScreen!}>
        <LoadingSpinner />
      </Dialog>
    ) : (
      <Formik
        {...rest}
        onSubmit={this.handleSubmit}
        validateOnMount={false}
      >
        {(formikProps: FormikProps<Values>) => (
          <FormikSubmitDetector {...formikProps}>
            <Prompt when={formikProps.dirty} message={() => intlText('confirm_close')} />
            <Dialog open={this.props.open} onClose={this.handleClose(formikProps, intlText('confirm_close'))} fullScreen={fullScreen!} maxWidth="lg">
              <DialogTitle>{this.props.title}</DialogTitle>
              <DialogContent style={{minWidth: '300px'}}>{render(formikProps)}</DialogContent>
              <DialogActions>
                <BlackButton onClick={this.handleClose(formikProps, intlText('confirm_close'))}>
                  <FormattedMessage id="general.action.cancel" />
                </BlackButton>
                <BlackButton onClick={formikProps.submitForm} disabled={formikProps.isSubmitting}>
                  {this.props.confirmText || intlText('general.action.save', true)}
                </BlackButton>
              </DialogActions>
            </Dialog>
          </FormikSubmitDetector>
        )}
      </Formik>
    );
  }
}
