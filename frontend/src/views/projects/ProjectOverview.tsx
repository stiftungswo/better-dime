import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { ProjectStore } from '../../stores/projectStore';
import { Project, ProjectListing } from '../../types';
import compose from '../../utilities/compose';
import { Formatter } from '../../utilities/formatter';

export type Props = {
  projectStore?: ProjectStore;
  formatter?: Formatter;
} & RouteComponentProps;

@compose(
  inject('projectStore', 'formatter'),
  observer,
  withRouter,
)
export default class ProjectOverview extends React.Component<Props> {
  columns: Array<Column<ProjectListing>>;

  constructor(props: Props) {
    super(props);
    const formatDate = this.props.formatter!.formatDate;
    this.columns = [
      {
        id: 'id',
        label: 'ID',
      },
      {
        id: 'listing_name',
        label: 'Name',
      },
      {
        id: 'description',
        label: 'Beschreibung',
      },
      {
        id: 'updated_at',
        label: 'Zuletzt geändert',
        format: d => formatDate(d.updated_at),
      },
    ];

    const search = new URLSearchParams(this.props.location.search);
    const paginationPage = search.get('page');

    if (paginationPage != null) {
      const pageNumber = parseInt(paginationPage, 10);

      if (!isNaN(pageNumber)) {
        this.props.projectStore!.paginationPage = pageNumber;
      }
    }
  }

  render() {
    const projectStore = this.props.projectStore;

    return (
      <Overview
        archivable
        searchable
        paginated
        title={'Projekte'}
        store={projectStore!}
        addAction={'/projects/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity: Project = await projectStore!.duplicate(e.id);
                this.props.history.push(`/projects/${newEntity.id}`);
              }
            }}
            archiveAction={(!e.archived && e.id) ? () => projectStore!.archive(e.id!, true).then(r => projectStore!.fetchAllPaginated()) : undefined}
            deleteAction={(e.deletable && e.id) ? () => projectStore!.delete(e.id!).then(r => projectStore!.fetchAllPaginated()) : undefined}
            deleteMessage={'Möchtest du dieses Projekt wirklich löschen?'}
            restoreAction={(e.archived && e.id) ? () => projectStore!.archive(e.id!, false).then(r => projectStore!.fetchAllPaginated()) : undefined}
          />
        )}
        onClickRow={'/projects/:id'}
        columns={this.columns}
      />
    );
  }
}
