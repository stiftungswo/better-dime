import { Formik, FormikConfig, FormikProps } from 'formik';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Prompt } from 'react-router';
import {Schema} from 'yup';
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
  // we need to pass formik.dirty to check whether the page was saved.
  appBarButtons?: (dirty: boolean) => React.ReactNode;
}

interface Props<T> extends FormViewProps<T> {
  render: (props: FormikProps<T>) => React.ReactNode;
  validationSchema: Schema<T>;
  // the used has to explicitly pass intl, as
  // @injectIntl didn't work due to the template logic.
  intl: IntlShape;
}
export class FormView<Values = object, ExtraProps = {}> extends React.Component<FormikConfig<Values> & ExtraProps & Props<Values>> {

  render() {
    // tslint:disable-next-line:no-any ; need this so we can spread into ...rest
    const { appBarButtons, intl, render, ...rest } = this.props as any;
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
        validateOnMount={false}
      >
        {(formikProps: FormikProps<Values>) => (
          <FormikSubmitDetector {...formikProps}>
            <Prompt when={!this.props.submitted && formikProps.dirty} message={() => intl.formatMessage({id: 'form.view.warn_discard_changes'})} />
            <DimeAppBar title={this.props.title}>
              {appBarButtons && appBarButtons(formikProps.dirty)}
              <DimeAppBarButton icon={SaveIcon} title={intl.formatMessage({id: 'general.action.save'})} action={formikProps.handleSubmit} disabled={formikProps.isSubmitting} />
            </DimeAppBar>
            <DimeContent paper={this.props.paper}>{render(formikProps)}</DimeContent>
          </FormikSubmitDetector>
        )}
      </Formik>
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
