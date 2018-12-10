import { Formik, FormikBag, FormikConfig, FormikProps, FormikState } from 'formik';
import * as React from 'react';
import { Fragment } from 'react';
import { DimeAppBar, DimeAppBarButton } from '../layout/DimeAppBar';
import { DimeContent } from '../layout/DimeContent';
import { Prompt } from 'react-router';
import { SaveIcon } from '../layout/icons';
import { HandleFormikSubmit } from '../types';

export interface FormViewProps<T> {
  title: string;
  onSubmit: (values: T) => Promise<void>;
  submitted?: boolean;
  loading?: boolean;
  paper?: boolean;
  appBarButtons?: React.ReactNode;
}

interface Props<T> extends FormViewProps<T> {
  render: (props: FormikProps<T>) => React.ReactNode;
}

export class FormView<Values = object, ExtraProps = {}> extends React.Component<
  FormikConfig<Values> & ExtraProps & Props<Values>,
  FormikState<Values>
> {
  private handleSubmit: HandleFormikSubmit<Values> = async (values, formikBag) => {
    try {
      await this.props.onSubmit(this.props.validationSchema.cast(values));
    } finally {
      formikBag.setSubmitting(false);
    }
  };

  public render() {
    // tslint:disable-next-line:no-any ; need this so we can spread into ...rest
    const { appBarButtons, ...rest } = this.props as any;
    return this.props.loading ? (
      <Fragment>
        <DimeAppBar title={this.props.title} />
        <DimeContent loading />
      </Fragment>
    ) : (
      <Formik
        {...rest}
        enableReinitialize
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<Values>) => (
          <Fragment>
            <Prompt when={!this.props.submitted && formikProps.dirty} message={() => 'Änderungen verwerfen?'} />
            <DimeAppBar title={this.props.title}>
              {appBarButtons}
              <DimeAppBarButton icon={SaveIcon} title={'Speichern'} action={formikProps.handleSubmit} disabled={formikProps.isSubmitting} />
            </DimeAppBar>
            <DimeContent paper={this.props.paper}>{this.props.render(formikProps)}</DimeContent>
          </Fragment>
        )}
      />
    );
  }
}
