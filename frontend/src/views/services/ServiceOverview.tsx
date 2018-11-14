import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { Service } from './types';
import { MainStore } from '../../stores/mainStore';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';

export interface Props {
  serviceStore?: ServiceStore;
  mainStore?: MainStore;
}

@compose(
  inject('serviceStore', 'mainStore'),
  observer
)
export default class ServiceOverview extends React.Component<Props> {
  public columns: Array<Column<Service>> = [];

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

  public renderActions = (service: Service) => (
    <ActionButtons
      editAction={`/services/${service.id}`}
      deleteAction={() => this.props.serviceStore!.delete(service.id!)}
      archiveAction={todo}
      copyAction={todo}
    />
  );

  public navigateTo(id: number) {
    //TODO: can this be extracted and used from overview? maybe add row rendering as render prop?
    this.props.mainStore!.navigateTo(`/services/${id}`);
  }

  public render() {
    return (
      <Overview
        title={'Services'}
        store={this.props.serviceStore!}
        addAction={'/services/new'}
        columns={this.columns}
        renderActions={this.renderActions}
      />
    );
  }
}
