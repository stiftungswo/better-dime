import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { Service, ServiceListing } from './types';
import { MainStore } from '../../stores/mainStore';
import Overview, { Column } from '../../layout/Overview';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';
import { RouteComponentProps, withRouter } from 'react-router';

export type Props = {
  serviceStore?: ServiceStore;
  mainStore?: MainStore;
} & RouteComponentProps;

@compose(
  inject('serviceStore', 'mainStore'),
  observer,
  withRouter
)
export default class ServiceOverview extends React.Component<Props> {
  public columns: Array<Column<ServiceListing>> = [];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'id',
        numeric: true,
        label: 'ID',
      },
      {
        id: 'name',
        numeric: false,
        label: 'Name',
        format: s => s.name + (s.archived ? ' [A]' : ''),
      },
      {
        id: 'description',
        numeric: false,
        label: 'Beschreibung',
      },
    ];
  }

  public filter = (s: ServiceListing, query: string) =>
    [`${s.id}`, s.name, s.description].some(field => field.toLowerCase().includes(query.toLowerCase()));

  public render() {
    const serviceStore = this.props.serviceStore;

    return (
      <Overview
        archivable
        title={'Services'}
        store={this.props.serviceStore!}
        addAction={'/services/new'}
        columns={this.columns}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Service = await serviceStore!.duplicate(e.id);
              this.props.history.push(`/services/${newEntity.id}`);
            }}
            archiveAction={!e.archived ? () => serviceStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => serviceStore!.archive(e.id, false) : undefined}
          />
        )}
        onClickRow={'/services/:id'}
        searchFilter={this.filter}
      />
    );
  }
}
