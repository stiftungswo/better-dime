import { inject, observer } from 'mobx-react';
import React from 'react';
import { ProjectCommentStore } from 'src/stores/projectCommentStore';
import { TimetrackFilterStore } from 'src/stores/timetrackFilterStore';
import { ActionButton } from '../../layout/ActionButton';
import { AddCommentIcon, AddEffortIcon } from '../../layout/icons';
import { Column } from '../../layout/Overview';
import PrintButton from '../../layout/PrintButton';
import { EffortStore } from '../../stores/effortStore';
import { ProjectCommentListing, ProjectEffortListing } from '../../types';
import { Formatter } from '../../utilities/formatter';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';

interface Props {
  displayTotal: string;
  efforts: ProjectEffortListing[];
  entityId: number;
  title: string;
  onEffortAdd: () => void;
  onClickEffortRow: (entity: ProjectEffortListing) => void;
  projectCommentStore?: ProjectCommentStore;
  effortStore?: EffortStore;
  timetrackFilterStore?: TimetrackFilterStore;
  formatter?: Formatter;
  effortReportUrlParams: () => object;
}

@inject('projectCommentStore', 'effortStore', 'timetrackFilterStore', 'formatter')
@observer
export class TimetrackProjectTable extends React.Component<Props> {

  effortColumns: Array<Column<ProjectEffortListing>> = [];
  commentColumns: Array<Column<ProjectCommentListing>> = [];

  constructor(props: Props) {
    super(props);
    const formatter = props.formatter!;

    this.effortColumns = [
      {
        id: 'date',
        numeric: false,
        label: 'Datum',
        format: e => formatter.formatDate(e.date),
        defaultSort: 'desc',
      },
      {
        id: 'employee',
        numeric: false,
        label: 'Mitarbeiter',
        format: e => e.employee_full_name,
        defaultSort: 'desc',
      },
      {
        id: '',
        numeric: false,
        label: 'Service',
        format: projectEffortListing =>
          projectEffortListing.position_description
            ? projectEffortListing.service_name + ' (' + projectEffortListing.position_description + ')'
            : projectEffortListing.service_name,
      },
      {
        id: 'effort_value',
        numeric: true,
        label: 'Gebuchter Wert',
        format: h => formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];

    this.commentColumns = [
      /*
      {
        id: 'date',
        numeric: false,
        label: 'Kommentare',
        format: e => formatter.formatDate(e.date),
        defaultSort: 'desc',
      },
      */
      {
        id: 'comment',
        numeric: false,
        label: 'Kommentare',
        format: e => e.comment,
        defaultSort: 'desc',
      },
    ];
  }

  onClickCommentRow = async (entity: ProjectCommentListing | undefined) => {
    if (entity && entity.id) {
      await this.props.projectCommentStore!.fetchOne(entity.id);
      this.props.projectCommentStore!.editing = true;
    }
  }

  handleProjectCommentAdd = () => {
    this.props.projectCommentStore!.projectCommentTemplate!.project_id = this.props.entityId;
    this.props.projectCommentStore!.editing = true;
  }

  render() {
    const projectGroupActions = (
      <>
        <PrintButton
          path={'projects/' + this.props.entityId + '/effort_report'}
          title={'Aufwandsrapport drucken'}
          urlParams={this.props.effortReportUrlParams()}
        />
        <ActionButton icon={AddCommentIcon} action={this.handleProjectCommentAdd} title={'Kommentar hinzufügen'} />
        <ActionButton icon={AddEffortIcon} title={'Aufwand hinzufügen'} action={this.props.onEffortAdd} />
      </>
    );

    const comments = this.props.projectCommentStore!.projectComments.filter((comment: ProjectCommentListing) => comment.project_id === this.props.entityId);

    return (
      <TimetrackEntityGroup
        actions={projectGroupActions}
        columns={this.effortColumns}
        commentColumns={this.commentColumns}
        displayTotal={this.props.displayTotal}
        efforts={this.props.efforts}
        comments={comments}
        onClickEffortRow={this.props.onClickEffortRow}
        onClickCommentRow={this.onClickCommentRow}
        title={this.props.title}
      />
    );
  }
}
