import { inject, observer } from 'mobx-react';
import React from 'react';
import { ActionButton } from '../../layout/ActionButton';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { DeleteIcon, MoveIcon } from '../../layout/icons';
import { Column } from '../../layout/Overview';
import { OverviewTable } from '../../layout/OverviewTable';
import { EffortStore } from '../../stores/effortStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ProjectEffortListing } from '../../types';
import EffortMoveDialog from './EffortMoveDialog';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';

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
  state = {
    moving: false,
  };

  isComponentMounted = false;

  handleDelete = async () => {
    const effortStore = this.props.effortStore!;
    const filterStore = this.props.timetrackFilterStore!;
    await Promise.all(this.selectedIds.map(id => effortStore.delete(id)));
    await effortStore.fetchWithProjectEffortFilter(filterStore.filter);
    this.selectedIds.forEach(id => filterStore.selectedEffortIds.set(id, false));
  }

  handleMove = async () => {
    if (this.isComponentMounted) {
      // this.selectedIds.forEach(id => this.props.timetrackFilterStore!.selectedEffortIds.set(id, false));
      this.setState({moving: false});
    }
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

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
          selectedCount={selectedIds.length}
          selectedActions={
            <>
              <ActionButton icon={MoveIcon} action={() => (this.setState({moving: true}))} title={'Verschieben'} />
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
        {this.state.moving && <EffortMoveDialog effortIds={selectedIds} onClose={this.handleMove} />}
      </>
    );
  }
}
