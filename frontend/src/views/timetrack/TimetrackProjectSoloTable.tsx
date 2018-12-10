import React from 'react';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { Column } from '../../layout/Overview';
import { ProjectEffortListing } from '../../types';
import { IconButton } from '@material-ui/core';
import { AddEffortIcon } from '../../layout/icons';

interface Props {
  displayTotal: string;
  onEffortAdd: () => void;
  efforts: ProjectEffortListing[];
  formatRateEntry: (value: number, factor: number | undefined, unit: string) => string;
  onClickRow: (entity: ProjectEffortListing) => void;
  title: string;
}

export class TimetrackProjectSoloTable extends React.Component<Props> {
  public columns: Array<Column<ProjectEffortListing>> = [];

  public constructor(props: Props) {
    super(props);

    this.columns = [
      {
        id: 'date',
        numeric: false,
        label: 'Datum',
      },
      {
        id: 'position_description',
        numeric: false,
        label: 'Aktivität',
      },
      {
        id: 'effort_value',
        numeric: true,
        label: 'Gebuchter Wert',
        format: h => this.props.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  public projectGroupActions = (
    <>
      <IconButton onClick={this.props.onEffortAdd}>
        <AddEffortIcon />
      </IconButton>
    </>
  );

  public render() {
    return (
      <TimetrackEntityGroup
        actions={this.projectGroupActions}
        columns={this.columns}
        displayTotal={this.props.displayTotal}
        efforts={this.props.efforts}
        onClickRow={this.props.onClickRow}
        title={this.props.title}
      />
    );
  }
}
