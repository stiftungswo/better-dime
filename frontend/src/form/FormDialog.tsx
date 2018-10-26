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
  render: (props: FormikProps<T>) => React.ReactNode;
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
        render={props => (
          <>
            <Prompt when={props.dirty} message={() => 'Änderungen verwerfen?'} />
            <Dialog open={this.props.open} onClose={this.handleClose(props)}>
              <DialogContent>{this.props.render(props as any)}</DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose(props)}>Abbruch</Button>
                <Button onClick={props.submitForm} disabled={props.isSubmitting}>
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
