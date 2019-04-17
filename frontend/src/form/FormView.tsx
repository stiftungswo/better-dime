import { Formik, FormikConfig, FormikProps } from 'formik';
import * as React from 'react';
import { Prompt } from 'react-router';
import { DimeAppBar, DimeAppBarButton } from '../layout/DimeAppBar';
import { DimeContent } from '../layout/DimeContent';
import { SaveIcon } from '../layout/icons';
import { HandleFormikSubmit } from '../types';
import { FormikSubmitDetector } from './FormikSubmitDetector';

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

export class FormView<Values = object, ExtraProps = {}> extends React.Component<FormikConfig<Values> & ExtraProps & Props<Values>> {

  render() {
    // tslint:disable-next-line:no-any ; need this so we can spread into ...rest
    const { appBarButtons, ...rest } = this.props as any;
    return this.props.loading ? (
      <React.Fragment>
        <DimeAppBar title={this.props.title} />
        <DimeContent loading />
      </React.Fragment>
    ) : (
      <Formik
        {...rest}
        enableReinitialize
        onSubmit={this.handleSubmit}
        isInitialValid={true}
        render={(formikProps: FormikProps<Values>) => (
          <FormikSubmitDetector {...formikProps}>
            <Prompt when={!this.props.submitted && formikProps.dirty} message={() => 'Änderungen verwerfen?'} />
            <DimeAppBar title={this.props.title}>
              {appBarButtons}
              <DimeAppBarButton icon={SaveIcon} title={'Speichern'} action={formikProps.handleSubmit} disabled={formikProps.isSubmitting} />
            </DimeAppBar>
            <DimeContent paper={this.props.paper}>{this.props.render(formikProps)}</DimeContent>
          </FormikSubmitDetector>
        )}
      />
    );
  }
  private handleSubmit: HandleFormikSubmit<Values> = async (values, formikBag) => {
    try {
      await this.props.onSubmit(this.props.validationSchema.cast(values));
    } finally {
      formikBag.setSubmitting(false);
    }
  }
}
