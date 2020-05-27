import {inject, observer} from 'mobx-react';
import React from 'react';
import {Column} from '../../layout/Overview';
import {OverviewTable} from '../../layout/OverviewTable';
import {EffortStore} from '../../stores/effortStore';
import {TimetrackFilterStore} from '../../stores/timetrackFilterStore';
import {ProjectEffortListing} from '../../types';
import {TimetrackExpansionPanel} from './TimetrackExpansionPanel';

interface Props {
  actions?: React.ReactNode;
  columns: Array<Column<ProjectEffortListing>>;
  displayTotal?: string;
  efforts: ProjectEffortListing[];
  onClickRow?: (entity: ProjectEffortListing) => void;
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

  render() {
    const { actions, columns, efforts, onClickRow, title, displayTotal } = this.props;
    const filterStore = this.props.timetrackFilterStore!;
    const selectedIds = this.selectedIds;

    const setSelected = (effort: ProjectEffortListing, state: boolean) => {
      filterStore.selectedEffortIds.set(effort.id, state);
    };

    return (
      <>
        <TimetrackExpansionPanel
          actions={actions}
          title={title}
          displayTotal={displayTotal}
        >
          {efforts.length > 0 ? (
            <>
              <OverviewTable columns={columns} data={efforts} onClickRow={onClickRow} selected={selectedIds} setSelected={setSelected} />
            </>
          ) : (
            'Keine Leistungen erfasst mit den gewählten Filtern.'
          )}
        </TimetrackExpansionPanel>
      </>
    );
  }
}
