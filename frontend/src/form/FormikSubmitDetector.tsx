import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';

interface Props {
  children: React.ReactNode;
  isSubmitting: boolean;
  isValid: boolean;
  errors?: any;
  mainStore?: MainStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore'),
  observer,
)
export class FormikSubmitDetector extends React.Component<Props> {
  //  SOURCE: https://github.com/jaredpalmer/formik/issues/1019
  componentDidUpdate(prevProps: Props) {
    const hasErrors = this.props.errors.constructor === Object && Object.keys(this.props.errors).length > 0;
    if (prevProps.isSubmitting && !this.props.isSubmitting && (!this.props.isValid || hasErrors)) {
      if (!this.props.isValid) {
        // you can only show one error message at a time?!
        if (this.props.errors.errorMessage) {
          this.props.mainStore!.displayError(this.props.errors.errorMessage);
        } else {
            this.props.mainStore!.displayError(this.props.intl!.formatMessage({id: 'form.failed_to_save'}));
        }
      }
      // tslint:disable-next-line:no-console
      console.log('We got submit errors: ', this.props.errors);
    }
  }

  render() {
    return <>{this.props.children}</>;
  }
}
