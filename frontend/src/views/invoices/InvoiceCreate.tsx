import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InvoiceStore } from '../../stores/invoiceStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import InvoiceForm from './InvoiceForm';
import compose from '../../utilities/compose';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { Invoice } from '../../types';
import { invoiceTemplate } from './invoiceSchema';

export interface Props extends RouteComponentProps, InjectedNotistackProps {
  invoiceStore?: InvoiceStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('invoiceStore'),
  observer
)
export default class InvoiceCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  public handleSubmit = (invoice: Invoice) => {
    return this.props.invoiceStore!.post(invoice).then(() => {
      this.setState({ submitted: true });
      const idOfNewInvoice = this.props!.invoiceStore!.invoice!.id;
      this.props.history.replace('/invoices/' + idOfNewInvoice);
    });
  };

  public render() {
    return (
      <InvoiceForm
        title={'Rechnung erstellen'}
        onSubmit={this.handleSubmit}
        invoice={invoiceTemplate as any}
        submitted={this.state.submitted}
      />
    );
  }
}
