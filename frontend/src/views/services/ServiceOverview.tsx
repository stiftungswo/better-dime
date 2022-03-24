import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { ServiceStore } from '../../stores/serviceStore';
import { Service, ServiceListing } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

export type Props = {
  serviceStore?: ServiceStore;
  mainStore?: MainStore;
  intl?: IntlShape;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('serviceStore', 'mainStore'),
  observer,
  withRouter,
)
export default class ServiceOverview extends React.Component<Props> {
  render() {
    const serviceStore = this.props.serviceStore;
    const intlText = wrapIntl(this.props.intl!, 'view.service.overview');

    const columns: Array<Column<ServiceListing>> = [
      {
        id: 'id',
        numeric: true,
        label: 'ID',
        defaultSort: 'desc',
      },
      {
        id: 'order',
        numeric: true,
        label: intlText('order'),
      },
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
        format: s => s.name + (s.archived ? ' [A]' : ''),
      },
      {
        id: 'description',
        numeric: false,
        label: intlText('general.description', true),
      },
    ];

    return (
      <Overview
        archivable
        paginated
        searchable
        title={intlText('general.service.plural', true)}
        store={this.props.serviceStore!}
        addAction={'/services/new'}
        columns={columns}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity: Service = await serviceStore!.duplicate(e.id);
                this.props.history.push(`/services/${newEntity.id}`);
              }
            }}
            archiveAction={(!e.archived && e.id) ? () => serviceStore!.archive(e.id!, true).then(r => serviceStore!.fetchAllPaginated()) : undefined}
            restoreAction={(e.archived && e.id) ? () => serviceStore!.archive(e.id!, false).then(r => serviceStore!.fetchAllPaginated()) : undefined}
          />
        )}
        onClickRow={'/services/:id'}
      />
    );
  }
}
