import React from 'react';
import { OverviewTable } from '../../layout/OverviewTable';
import { Column } from '../../layout/Overview';
import { ProjectEffortListing } from '../../types';
import { TimetrackExpansionPanel } from './TimetrackExpansionPanel';

interface Props {
  actions?: React.ReactNode;
  columns: Array<Column<ProjectEffortListing>>;
  displayTotal?: string;
  efforts: ProjectEffortListing[];
  onClickRow?: (entity: ProjectEffortListing) => void;
  title: string;
}

export class TimetrackEntityGroup extends React.Component<Props> {
  public render() {
    const { actions, columns, efforts, onClickRow, title, displayTotal } = this.props;

    return (
      <TimetrackExpansionPanel actions={actions} title={title} displayTotal={displayTotal}>
        {efforts.length > 0 && <OverviewTable columns={columns} data={efforts} onClickRow={onClickRow} />}
        {efforts.length <= 0 && 'Keine Leistungen erfasst mit den gewählten Filtern.'}
      </TimetrackExpansionPanel>
    );
  }
}
