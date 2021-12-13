import {inject, observer} from 'mobx-react';
import moment from 'moment';
import React from 'react';
import {Column} from '../../layout/Overview';
import {OverviewTable} from '../../layout/OverviewTable';
import {EffortStore} from '../../stores/effortStore';
import {TimetrackFilterStore} from '../../stores/timetrackFilterStore';
import {ProjectCommentListing, ProjectEffortListing} from '../../types';
import {TimetrackAccordion} from './TimetrackAccordion';

interface Props {
  actions?: React.ReactNode;
  columns: Array<Column<ProjectEffortListing>>;
  displayTotal?: string;
  efforts: ProjectEffortListing[];
  comments?: ProjectCommentListing[];
  onClickRow?: (entity: ProjectEffortListing | ProjectCommentListing) => void;
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
    const { actions, columns, efforts, onClickRow, title, displayTotal } = this.props;
    const filterStore = this.props.timetrackFilterStore!;
    const selectedIds = this.selectedIds;
    const selectedCommentIds = this.selectedCommentIds;

    const setSelected = (entity: ProjectEffortListing | ProjectCommentListing, state: boolean) => {
      if ('comment' in entity) {
        filterStore.selectedCommentIds.set(entity.id, state);
      } else {
        filterStore.selectedEffortIds.set(entity.id, state);
      }
    };

    let effortsPlusComments: Array<ProjectEffortListing | ProjectCommentListing> = this.props.efforts;
    if (this.props.comments) {
      effortsPlusComments = effortsPlusComments.concat(this.props.comments);
      effortsPlusComments.sort((a, b) => {
        const dateA = moment(a.date);
        const dateB = moment(b.date);
        return dateB.valueOf() - dateA.valueOf();
      });
    }

    return (
      <>
        <TimetrackAccordion
          actions={actions}
          title={title}
          displayTotal={displayTotal}
        >
          {effortsPlusComments.length > 0 ? (
            <>
              <OverviewTable
                columns={columns}
                data={effortsPlusComments}
                onClickRow={onClickRow}
                selected={selectedIds.concat(selectedCommentIds)}
                setSelected={setSelected}
              />
            </>
          ) :
          (
            'Keine Aufwände erfasst mit den gewählten Filtern.'
          )}
        </TimetrackAccordion>
      </>
    );
  }
}
