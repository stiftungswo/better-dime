import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { Service } from './types';
import { MainStore } from '../../stores/mainStore';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
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
      deleteAction={() => this.props.serviceStore!.delete(service.id!)}
      archiveAction={todo}
      copyAction={async () => {
        if (service && service.id) {
          const newEntity: Service = await this.props.serviceStore!.duplicate(service.id);
          this.props.history.push(`/services/${newEntity.id}`);
        }
      }}
      deleteMessage="Das Löschen eines Services führt möglicherweise zu korrupten Offerten, Projekten und Rechnungen.\nWirklich löschen?"
    />
  );

  public navigateTo(id: number) {
    //TODO: can this be extracted and used from overview? maybe add row rendering as render prop?
    this.props.mainStore!.navigateTo(`/services/${id}`);
  }

  public filter = (s: Service, query: string) =>
    [`${s.id}`, s.name, s.description].some(field => field.toLowerCase().includes(query.toLowerCase()));

  public render() {
    return (
      <Overview
        title={'Services'}
        store={this.props.serviceStore!}
        addAction={'/services/new'}
        columns={this.columns}
        renderActions={this.renderActions}
        onClickRow={'/services/:id'}
        searchFilter={this.filter}
      />
    );
  }
}
