import React from 'react';
import { OverviewTable } from '../../layout/OverviewTable';
import { Column } from '../../layout/Overview';
import { ProjectEffortListing } from '../../types';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';
import { inject, observer } from 'mobx-react';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ActionButton } from '../../layout/ActionButton';
import { DeleteIcon, MoveIcon } from '../../layout/icons';
import { todo } from '../../index';
import { EffortStore } from '../../stores/effortStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import EffortMoveDialog from './EffortMoveDialog';

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
  public handleDelete = async () => {
    const effortStore = this.props.effortStore!;
    const filterStore = this.props.timetrackFilterStore!;
    await Promise.all(this.selectedIds.map(id => effortStore.delete(id)));
    await effortStore.fetchFiltered(filterStore.filter);
    this.selectedIds.forEach(id => filterStore.selectedEffortIds.set(id, false));
  };

  public handleMove = async () => {
    this.selectedIds.forEach(id => this.props.timetrackFilterStore!.selectedEffortIds.set(id, false));
    this.props.effortStore!.moving = false;
  };

  public get selectedIds() {
    const filterStore = this.props.timetrackFilterStore!;
    const effortIds = this.props.efforts.map(e => e.id);
    return Array.from(filterStore.selectedEffortIds.entries())
      .filter(([id, state]) => state && effortIds.includes(id))
      .map(([id, state]) => id);
  }

  public render() {
    const { actions, columns, efforts, onClickRow, title, displayTotal } = this.props;
    const filterStore = this.props.timetrackFilterStore!;
    const effortStore = this.props.effortStore!;
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
          selectedCount={selectedIds.length}
          selectedActions={
            <>
              <ActionButton icon={MoveIcon} action={() => (effortStore.moving = true)} title={'Verschieben'} />
              <DeleteButton onConfirm={this.handleDelete} />
            </>
          }
        >
          {efforts.length > 0 ? (
            <>
              <OverviewTable columns={columns} data={efforts} onClickRow={onClickRow} selected={selectedIds} setSelected={setSelected} />
            </>
          ) : (
            'Keine Leistungen erfasst mit den gewählten Filtern.'
          )}
        </TimetrackExpansionPanel>
        {effortStore.moving && <EffortMoveDialog effortIds={selectedIds} onClose={this.handleMove} />}
      </>
    );
  }
}
