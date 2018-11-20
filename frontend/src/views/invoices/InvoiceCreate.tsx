import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { InvoiceStore } from '../../stores/invoiceStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import InvoiceForm from './InvoiceForm';
import compose from '../../utilities/compose';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { computed } from 'mobx';
import { Invoice } from '../../types';

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

  constructor(props: Props) {
    super(props);
  }

  public handleSubmit = (invoice: Invoice) => {
    return this.props.invoiceStore!.post(invoice).then(() => {
      this.setState({ submitted: true });
      const idOfNewInvoice = this.props!.invoiceStore!.invoice!.id;
      this.props.history.replace('/invoices/' + idOfNewInvoice);
    });
  };

  @computed
  get invoice(): any {
    return {
      id: undefined,
      name: '',
      description: '',
      address_id: '',
      accountant_id: '',
      positions: [],
      discounts: [],
      costgroup_distributions: [],
      start: '',
      end: '',
    };
  }

  public render() {
    return (
      <InvoiceForm title={'Rechnung erstellen'} onSubmit={this.handleSubmit} invoice={this.invoice} submitted={this.state.submitted} />
    );
  }
}
