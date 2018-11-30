import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { InvoiceListing, InvoiceStore } from '../../stores/invoiceStore';
import compose from '../../utilities/compose';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import { ActionButtons } from '../../layout/ActionButtons';
import { MainStore } from '../../stores/mainStore';
import { Invoice } from '../../types';

export interface Props {
  mainStore?: MainStore;
  invoiceStore?: InvoiceStore;
}

@compose(
  inject('mainStore', 'invoiceStore'),
  observer
)
export default class InvoiceOverview extends React.Component<Props> {
  public columns: Column<InvoiceListing>[];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'id',
        label: 'ID',
        numeric: true,
      },
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'description',
        label: 'Beschreibung',
        format: i => props.mainStore!.trimString(i.description),
      },
      {
        id: 'start',
        label: 'Start',
        format: i => props.mainStore!.formatDate(i.start),
      },
      {
        id: 'end',
        label: 'Ende',
        format: i => props.mainStore!.formatDate(i.end),
      },
    ];
  }

  public render() {
    const invoiceStore = this.props.invoiceStore!;
    return (
      <Overview
        title={'Rechnungen'}
        store={invoiceStore}
        addAction={'/invoices/new'}
        renderActions={e => <ActionButtons copyAction={todo} deleteAction={() => invoiceStore!.delete(e.id)} />}
        onClickRow={'/invoices/:id'}
        columns={this.columns}
      />
    );
  }
}
