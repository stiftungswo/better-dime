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

  formatter = this.props.formatter!;

  effortColumns: Array<Column<ProjectEffortListing | ProjectCommentListing>> = [
    {
      id: 'date',
      numeric: false,
      label: 'Datum',
      format: e => 'comment' in e ? <span style={{ fontStyle: 'italic', color: 'rgb(100,100,100)' }}>{this.formatter.formatDate(e.date)}</span> : this.formatter.formatDate(e.date),
      defaultSort: 'desc',
    },
    {
      id: 'employee',
      numeric: false,
      label: 'Mitarbeiter',
      noSort: true,
      format: e => 'comment' in e ? (<span style={{ fontStyle: 'italic', color: 'rgb(100,100,100)' }}>{e.comment}</span>) : e.employee_full_name,
      defaultSort: 'desc',
    },
    {
      id: '',
      numeric: false,
      label: 'Service',
      noSort: true,
      format: e => 'comment' in e ? '' : (e.position_description ? e.service_name + ' (' + e.position_description + ')' : e.service_name),
    },
    {
      id: 'effort_value',
      numeric: true,
      noSort: true,
      label: 'Gebuchter Wert',
      format: h => 'comment' in h ? '' : this.formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
    },
  ];

  constructor(props: Props) {
    super(props);
  }

  onClickRow = async (entity: ProjectEffortListing | ProjectCommentListing) => {
    if (entity && entity.id) {
      if ('comment' in entity) {
        await this.props.projectCommentStore!.fetchOne(entity.id);
        this.props.projectCommentStore!.editing = true;
      } else {
        this.props.onClickEffortRow(entity);
      }
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

    const dates = this.props.efforts.map(e => e.date);
    const noEmployeeSelected = this.props.timetrackFilterStore!.selectedEmployees.length === 0;
    const comments = this.props.projectCommentStore!.projectComments
      .filter((comment: ProjectCommentListing) => comment.project_id === this.props.entityId)
      .filter((comment: ProjectCommentListing) => dates.includes(comment.date) || noEmployeeSelected);

    return (
      <TimetrackEntityGroup
        actions={projectGroupActions}
        columns={this.effortColumns}
        displayTotal={this.props.displayTotal}
        efforts={this.props.efforts}
        comments={comments}
        onClickRow={this.onClickRow}
        title={this.props.title}
      />
    );
  }
}
