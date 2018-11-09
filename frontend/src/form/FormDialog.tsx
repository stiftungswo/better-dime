import { Formik, FormikBag, FormikConfig, FormikProps } from 'formik';
import * as React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import { LoadingSpinner } from '../layout/DimeLayout';
import { Prompt } from 'react-router';

interface DialogFormProps<T> {
  title: string;
  onSubmit: (values: any) => Promise<any>;
  validationSchema?: any;
  render: (props: FormikProps<T>, id: number) => React.ReactNode;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export class FormDialog<Values = object, ExtraProps = {}> extends React.Component<
  FormikConfig<Values> & ExtraProps & DialogFormProps<Values>
> {
  public submit = async (values: any, formikBag: FormikBag<any, any>) => {
    await this.props.onSubmit(values);
    formikBag.setSubmitting(false);
  };

  public handleClose = (props: FormikProps<any>) => () => {
    if (props.dirty) {
      confirm('Änderungen verwerfen?') && this.props.onClose();
    } else {
      this.props.onClose();
    }
  };

  public render() {
    return this.props.loading ? (
      <Dialog open={this.props.open} onClose={this.props.onClose}>
        <LoadingSpinner />
      </Dialog>
    ) : (
      <Formik
        {...this.props as any}
        onSubmit={this.submit}
        render={formikProps => (
          <>
            <Prompt when={formikProps.dirty} message={() => 'Änderungen verwerfen?'} />
            <Dialog open={this.props.open} onClose={this.handleClose(formikProps)}>
              <DialogContent>{this.props.render(formikProps as any)}</DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose(formikProps)}>Abbruch</Button>
                <Button onClick={formikProps.submitForm} disabled={formikProps.isSubmitting}>
                  Speichern
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      />
    );
  }
}
