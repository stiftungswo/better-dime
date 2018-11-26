import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ProjectListing, ProjectStore } from '../../stores/projectStore';
import compose from '../../utilities/compose';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import { ActionButtons } from '../../layout/ActionButtons';
import { Project } from '../../types';
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
  public columns: Array<Column<ProjectListing>>;

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

  public filter = (p: Project, query: string) => {
    return [p.id + '', p.name, p.description].some(s => s.includes(query));
  };

  public render() {
    const projectStore = this.props.projectStore;

    return (
      <Overview
        title={'Projekte'}
        store={projectStore!}
        addAction={'/projects/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Project = await projectStore!.duplicate(e.id);
              this.props.history.push(`/projects/${newEntity.id}`);
            }}
            archiveAction={todo}
            deleteAction={todo}
          />
        )}
        onClickRow={'/projects/:id'}
        columns={this.columns}
        searchFilter={this.filter}
      />
    );
  }
}
