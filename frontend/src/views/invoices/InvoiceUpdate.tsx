import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import InvoiceForm from './InvoiceForm';
import compose from '../../utilities/compose';
import { InvoiceStore } from '../../stores/invoiceStore';
import { FormValues, Invoice } from '../../types';
import { action, computed, toJS } from 'mobx';

interface InvoiceDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<InvoiceDetailRouterProps> {
  invoiceStore?: InvoiceStore;
}

@compose(
  inject('invoiceStore'),
  observer
)
export default class InvoiceUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.invoiceStore!.fetchOne(Number(props.match.params.id));
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.props.invoiceStore!.fetchOne(Number(this.props.match.params.id));
    }
  }

  @action
  public handleSubmit = (invoice: Invoice) => {
    return this.props.invoiceStore!.put(invoice);
  };

  @computed
  public get invoice() {
    //it's important to detach the mobx proxy before passing it into formik - formik's deepClone can fall into endless recursions with those proxies.
    return toJS(this.props.invoiceStore!.invoice);
  }

  public render() {
    const invoice = this.invoice;
    const title = invoice ? `${invoice.name} - Rechnungen` : 'Rechnung bearbeiten';

    return <InvoiceForm title={title} onSubmit={this.handleSubmit} invoice={invoice as FormValues} />;
  }
}
