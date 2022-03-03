import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { ProjectStore } from '../../stores/projectStore';
import { Project, ProjectListing } from '../../types';
import compose from '../../utilities/compose';
import { Formatter } from '../../utilities/formatter';
import { wrapIntl } from '../../utilities/wrapIntl';

export type Props = {
  projectStore?: ProjectStore;
  intl?: IntlShape;
  formatter?: Formatter;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('projectStore', 'formatter'),
  observer,
  withRouter,
)
export default class ProjectOverview extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

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

    const intlText = wrapIntl(this.props.intl!, 'view.project.overview');
    const formatDate = this.props.formatter!.formatDate;
    const columns: Array<Column<ProjectListing>> = [
      {
        id: 'id',
        label: 'ID',
      },
      {
        id: 'listing_name',
        label: intlText('general.name', true),
      },
      {
        id: 'description',
        label: intlText('description'),
      },
      {
        id: 'updated_at',
        label: intlText('last_change'),
        format: d => formatDate(d.updated_at),
      },
    ];

    return (
      <Overview
        archivable
        searchable
        paginated
        title={intlText('general.project.plural', true)}
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
            deleteMessage={intlText('delete_warning')}
            restoreAction={(e.archived && e.id) ? () => projectStore!.archive(e.id!, false).then(r => projectStore!.fetchAllPaginated()) : undefined}
          />
        )}
        onClickRow={'/projects/:id'}
        columns={columns}
      />
    );
  }
}
