import { Formik, FormikBag, FormikConfig, FormikProps, FormikState } from 'formik';
import * as React from 'react';
import { Fragment } from 'react';
import { DimeAppBar, DimeAppBarButton } from '../layout/DimeAppBar';
import { DimeContent } from '../layout/DimeLayout';
import { Prompt } from 'react-router';
import { SaveIcon } from '../layout/icons';

export interface FormViewProps<T> {
  title: string;
  onSubmit: (values: any) => Promise<any>;
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
  private submit = async (values: any, formikBag: FormikBag<any, any>) => {
    try {
      await this.props.onSubmit(values);
    } finally {
      formikBag.setSubmitting(false);
    }
  };

  public render() {
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
        onSubmit={this.submit}
        render={props => (
          <Fragment>
            <Prompt when={!this.props.submitted && props.dirty} message={() => 'Änderungen verwerfen?'} />
            <DimeAppBar title={this.props.title}>
              {appBarButtons}
              <DimeAppBarButton icon={SaveIcon} title={'Speichern'} action={props.handleSubmit} disabled={props.isSubmitting} />
            </DimeAppBar>
            <DimeContent paper={this.props.paper}>{this.props.render(props as any)}</DimeContent>
          </Fragment>
        )}
      />
    );
  }
}
