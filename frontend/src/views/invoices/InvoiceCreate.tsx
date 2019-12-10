import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { InvoiceStore } from '../../stores/invoiceStore';
import { MainStore } from '../../stores/mainStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { FormValues, Invoice } from '../../types';
import compose from '../../utilities/compose';
import InvoiceForm from './InvoiceForm';
import { invoiceTemplate } from './invoiceSchema';

export interface Props extends RouteComponentProps {
  invoiceStore?: InvoiceStore;
  mainStore?: MainStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('invoiceStore', 'mainStore'),
  observer,
)
export default class InvoiceCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  handleSubmit = (invoice: Invoice) => {
    return this.props.invoiceStore!.post(invoice).then(() => {
      this.setState({ submitted: true });
      const idOfNewInvoice = this.props!.invoiceStore!.invoice!.id;
      this.props.history.replace('/invoices/' + idOfNewInvoice);
    });
  }

  render() {
    return (
      <InvoiceForm
        title={'Rechnung erstellen'}
        onSubmit={this.handleSubmit}
        invoice={
          {
            ...invoiceTemplate(),
            accountant_id: this.props.mainStore!.userId,
          } as FormValues
        }
        submitted={this.state.submitted}
      />
    );
  }
}
