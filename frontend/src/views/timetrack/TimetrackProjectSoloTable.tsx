import React from 'react';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { Column } from '../../layout/Overview';
import { ProjectEffortListing } from '../../types';
import { AddEffortIcon } from '../../layout/icons';
import { ActionButton } from '../../layout/ActionButton';
import { inject, observer } from 'mobx-react';
import { Formatter } from '../../utilities/formatter';
import PrintButton from '../../layout/PrintButton';

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
  public columns: Array<Column<ProjectEffortListing>> = [];

  public constructor(props: Props) {
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

  public projectGroupActions = (
    <>
      <PrintButton
        path={'projects/' + this.props.entityId + '/print_effort_report'}
        title={'Aufwandsrapport drucken'}
        urlParams={this.props.effortReportUrlParams()}
      />
      <ActionButton icon={AddEffortIcon} title={'Aufwand hinzufügen'} action={this.props.onEffortAdd} />
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
