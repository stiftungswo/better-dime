import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { InvoiceStore } from '../../stores/invoiceStore';
import { MainStore } from '../../stores/mainStore';
import { InvoiceListing } from '../../types';
import compose from '../../utilities/compose';

export type Props = {
  mainStore?: MainStore;
  invoiceStore?: InvoiceStore;
} & RouteComponentProps;

@compose(
  inject('mainStore', 'invoiceStore'),
  observer,
  withRouter,
)
export default class InvoiceOverview extends React.Component<Props> {
  columns: Array<Column<InvoiceListing>>;

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

  render() {
    const invoiceStore = this.props.invoiceStore!;
    return (
      <Overview
        searchable
        paginated
        title={'Rechnungen'}
        store={invoiceStore}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity = await invoiceStore!.duplicate(e.id);
              this.props.history.push(`/invoices/${newEntity.id}`);
            }}
            deleteAction={() => invoiceStore!.delete(e.id)}
          />
        )}
        onClickRow={'/invoices/:id'}
        columns={this.columns}
      />
    );
  }
}
