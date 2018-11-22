import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import InvoiceForm from './InvoiceForm';
import compose from '../../utilities/compose';
import { InvoiceStore } from '../../stores/invoiceStore';
import { Invoice } from '../../types';
import { toJS } from 'mobx';

interface InvoiceDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<InvoiceDetailRouterProps>, InjectedNotistackProps {
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

  public handleSubmit = (invoice: Invoice) => {
    return this.props.invoiceStore!.put(invoice);
  };

  public get invoice() {
    const invoice = this.props.invoiceStore!.invoice;
    if (invoice) {
      return {
        //it's important to detach the mobx proxy before passing it into formik - formik's deepClone can fall into endless recursions with those proxies.
        ...toJS(invoice),
        fixed_price: invoice.fixed_price || '',
        positions: invoice.positions.map(p => ({
          ...p,
          order: p.order || '',
        })),
      };
    } else {
      return undefined;
    }
  }

  public render() {
    const invoice = this.invoice;
    const title = invoice ? `${invoice.name} - Rechnungen` : 'Rechnung bearbeiten';

    return <InvoiceForm title={title} onSubmit={this.handleSubmit} invoice={invoice as any} />;
  }
}
