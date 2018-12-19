import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ProjectStore } from '../../stores/projectStore';
import compose from '../../utilities/compose';
import Overview, { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { Project, ProjectListing } from '../../types';
import { RouteComponentProps, withRouter } from 'react-router';

export type Props = {
  projectStore?: ProjectStore;
} & RouteComponentProps;

@compose(
  inject('projectStore'),
  observer,
  withRouter
)
export default class ProjectOverview extends React.Component<Props> {
  public columns: Column<ProjectListing>[];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'id',
        label: 'ID',
      },
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'description',
        label: 'Beschreibung',
      },
    ];
  }

  public render() {
    const projectStore = this.props.projectStore;

    return (
      <Overview
        archivable
        searchable
        title={'Projekte'}
        store={projectStore!}
        addAction={'/projects/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Project = await projectStore!.duplicate(e.id);
              this.props.history.push(`/projects/${newEntity.id}`);
            }}
            archiveAction={!e.archived ? () => projectStore!.archive(e.id, true) : undefined}
            deleteAction={e.deletable ? () => projectStore!.delete(e.id) : undefined}
            deleteMessage={'Möchtest du dieses Projekt wirklich löschen?'}
            restoreAction={e.archived ? () => projectStore!.archive(e.id, false) : undefined}
          />
        )}
        onClickRow={'/projects/:id'}
        columns={this.columns}
      />
    );
  }
}
