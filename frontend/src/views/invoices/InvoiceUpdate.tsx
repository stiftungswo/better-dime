import { action, computed, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { InvoiceStore } from '../../stores/invoiceStore';
import { FormValues, Invoice } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import InvoiceForm from './InvoiceForm';

interface InvoiceDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<InvoiceDetailRouterProps> {
  invoiceStore?: InvoiceStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('invoiceStore'),
  observer,
)
export default class InvoiceUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.invoiceStore!.fetchOne(Number(props.match.params.id));
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.invoiceStore!.fetchOne(Number(this.props.match.params.id));
    }
  }

  @action
  handleSubmit = (invoice: Invoice) => {
    return this.props.invoiceStore!.put(invoice);
  }

  @computed
  get invoice() {
    // it's important to detach the mobx proxy before passing it into formik
    // formik's deepClone can fall into endless recursions with those proxies.
    return toJS(this.props.invoiceStore!.invoice);
  }

  render() {
    const invoice = this.invoice;
    const intlText = wrapIntl(this.props.intl!, 'view.invoice.update');
    const title = invoice ? `${invoice.name} - ` + intlText('general.invoice', true) : intlText('edit_invoice');

    return <InvoiceForm title={title} onSubmit={this.handleSubmit} invoice={invoice as FormValues} />;
  }
}
