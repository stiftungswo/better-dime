import {inject, observer} from 'mobx-react';
import React from 'react';
import {Column} from '../../layout/Overview';
import {OverviewTable} from '../../layout/OverviewTable';
import {EffortStore} from '../../stores/effortStore';
import {TimetrackFilterStore} from '../../stores/timetrackFilterStore';
import {ProjectCommentListing, ProjectEffortListing} from '../../types';
import {TimetrackExpansionPanel} from './TimetrackExpansionPanel';

interface Props {
  actions?: React.ReactNode;
  columns: Array<Column<ProjectEffortListing>>;
  commentColumns?: Array<Column<ProjectCommentListing>>;
  displayTotal?: string;
  efforts: ProjectEffortListing[];
  comments?: ProjectCommentListing[];
  onClickEffortRow?: (entity: ProjectEffortListing) => void;
  onClickCommentRow?: (entity: ProjectCommentListing) => void;
  title: string;
  timetrackFilterStore?: TimetrackFilterStore;
  effortStore?: EffortStore;
}

@inject('timetrackFilterStore', 'effortStore')
@observer
export class TimetrackEntityGroup extends React.Component<Props> {
  get selectedIds() {
    const filterStore = this.props.timetrackFilterStore!;
    const effortIds = this.props.efforts.map(e => e.id);
    return Array.from(filterStore.selectedEffortIds.entries())
      .filter(([id, state]) => state && effortIds.includes(id))
      .map(([id, state]) => id);
  }

  get selectedCommentIds() {
    const filterStore = this.props.timetrackFilterStore!;
    const commentIds = this.props.comments?.map(c => c.id);
    return Array.from(filterStore.selectedCommentIds.entries())
      .filter(([id, state]) => state && commentIds?.includes(id))
      .map(([id, state]) => id);
  }

  render() {
    const { actions, columns, efforts, onClickEffortRow, title, displayTotal } = this.props;
    const filterStore = this.props.timetrackFilterStore!;
    const selectedIds = this.selectedIds;
    const selectedCommentIds = this.selectedCommentIds;

    const setSelectedEfforts = (effort: ProjectEffortListing, state: boolean) => {
      filterStore.selectedEffortIds.set(effort.id, state);
    };

    const setSelectedComments = (comment: ProjectCommentListing, state: boolean) => {
      filterStore.selectedCommentIds.set(comment.id, state);
    };

    return (
      <>
        <TimetrackExpansionPanel
          actions={actions}
          title={title}
          displayTotal={displayTotal}
        >
          {efforts.length > 0 && (
            <>
              <OverviewTable
                columns={columns}
                data={efforts}
                onClickRow={onClickEffortRow}
                selected={selectedIds}
                setSelected={setSelectedEfforts}
              />
            </>
          )}
          {(this.props.commentColumns && this.props.comments && this.props.comments.length > 0) && (
              <>
                <br />
                <OverviewTable
                  noSort={true}
                  columns={this.props.commentColumns}
                  data={this.props.comments}
                  onClickRow={this.props.onClickCommentRow}
                  selected={selectedCommentIds}
                  setSelected={setSelectedComments}
                />
              </>
          )}
          {efforts.length === 0 && this.props.comments === undefined &&
          (
            'Keine Aufwände erfasst mit den gewählten Filtern.'
          )}
        </TimetrackExpansionPanel>
      </>
    );
  }
}
