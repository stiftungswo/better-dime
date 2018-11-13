import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ProjectListing, ProjectStore } from '../../stores/projectStore';
import compose from '../../utilities/compose';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import { ActionButtons } from '../../layout/ActionButtons';
import { Project } from '../../types';

export interface Props {
  projectStore?: ProjectStore;
}

@compose(
  inject('projectStore'),
  observer
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
    return (
      <Overview
        title={'Projekte'}
        store={this.props.projectStore!}
        addAction={'/projects/new'}
        renderActions={e => <ActionButtons copyAction={todo} editAction={`/projects/${e.id}`} archiveAction={todo} deleteAction={todo} />}
        onClickRow={'/projects/:id'}
        columns={this.columns}
        searchFilter={this.filter}
      />
    );
  }
}
