import { inject, observer } from 'mobx-react';
import React from 'react';
import { ActionButton } from '../../layout/ActionButton';
import { AddEffortIcon } from '../../layout/icons';
import { Column } from '../../layout/Overview';
import PrintButton from '../../layout/PrintButton';
import { ProjectEffortListing } from '../../types';
import { Formatter } from '../../utilities/formatter';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';

interface Props {
  displayTotal: string;
  onEffortAdd: () => void;
  efforts: ProjectEffortListing[];
  entityId: number;
  onClickRow: (entity: ProjectEffortListing) => void;
  title: string;
  formatter?: Formatter;
  effortReportUrlParams: () => object;
}

@inject('mainStore', 'formatter')
@observer
export class TimetrackProjectSoloTable extends React.Component<Props> {
  columns: Array<Column<ProjectEffortListing>> = [];

  projectGroupActions = (
    <>
      <PrintButton
        path={'projects/' + this.props.entityId + '/effort_report'}
        title={'Aufwandsrapport drucken'}
        urlParams={this.props.effortReportUrlParams()}
      />
      <ActionButton icon={AddEffortIcon} title={'Aufwand hinzufügen'} action={this.props.onEffortAdd} />
    </>
  );

  constructor(props: Props) {
    super(props);
    const formatter = props.formatter!;

    this.columns = [
      {
        id: 'date',
        numeric: false,
        label: 'Datum',
        format: e => formatter.formatDate(e.date),
        defaultSort: 'desc',
      },
      {
        id: '',
        numeric: false,
        label: 'Aktivität',
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
  }

  render() {
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
