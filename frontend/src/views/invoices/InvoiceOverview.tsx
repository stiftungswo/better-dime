import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { InvoiceStore } from '../../stores/invoiceStore';
import { MainStore } from '../../stores/mainStore';
import { InvoiceListing } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

export type Props = {
  mainStore?: MainStore;
  invoiceStore?: InvoiceStore;
  intl?: IntlShape;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('mainStore', 'invoiceStore'),
  observer,
  withRouter,
)
export default class InvoiceOverview extends React.Component<Props> {
  render() {
    const invoiceStore = this.props.invoiceStore!;
    const mainStore = this.props.mainStore!;

    const intlText = wrapIntl(this.props.intl!, 'view.invoice.overview');
    const columns: Array<Column<InvoiceListing>> = [
      {
        id: 'id',
        label: 'ID',
        numeric: true,
      },
      {
        id: 'name',
        label: intlText('general.name', true),
      },
      {
        id: 'description',
        label: intlText('description'),
        format: i => mainStore.trimString(i.description),
      },
      {
        id: 'beginning',
        label: intlText('start'),
        format: i => mainStore.formatDate(i.beginning),
      },
      {
        id: 'ending',
        label: intlText('end'),
        format: i => mainStore.formatDate(i.ending),
      },
    ];

    return (
      <Overview
        searchable
        paginated
        title={intlText('general.invoice.plural', true)}
        store={invoiceStore}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity = await invoiceStore!.duplicate(e.id);
                this.props.history.push(`/invoices/${newEntity.id}`);
              }
            }}
            deleteAction={() => {
              if (e.id) {
                invoiceStore!.delete(e.id).then(r => invoiceStore!.fetchAllPaginated());
              }
            }}
          />
        )}
        onClickRow={'/invoices/:id'}
        columns={columns}
      />
    );
  }
}
