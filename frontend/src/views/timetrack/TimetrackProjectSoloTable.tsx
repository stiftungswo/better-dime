import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { ActionButton } from '../../layout/ActionButton';
import { AddEffortIcon } from '../../layout/icons';
import { Column } from '../../layout/Overview';
import PrintButton from '../../layout/PrintButton';
import { ProjectEffortListing } from '../../types';
import compose from '../../utilities/compose';
import { Formatter } from '../../utilities/formatter';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';

interface Props {
  displayTotal: string;
  efforts: ProjectEffortListing[];
  entityId: number;
  onEffortAdd: () => void;
  onClickRow: (entity: ProjectEffortListing) => void;
  title: string;
  formatter?: Formatter;
  effortReportUrlParams: () => object;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'formatter'),
  observer,
)
export class TimetrackProjectSoloTable extends React.Component<Props> {
  columns: Array<Column<ProjectEffortListing>> = [];

  constructor(props: Props) {
    super(props);
    const formatter = props.formatter!;
    const intl = this.props.intl!;

    this.columns = [
      {
        id: 'date',
        numeric: false,
        label: intl.formatMessage({id: 'general.date'}),
        format: e => formatter.formatDate(e.date),
        defaultSort: 'desc',
      },
      {
        id: 'employee',
        numeric: false,
        label: intl.formatMessage({id: 'general.employee'}),
        format: e => e.employee_full_name,
        defaultSort: 'desc',
      },
      {
        id: '',
        numeric: false,
        label: intl.formatMessage({id: 'general.service'}),
        format: projectEffortListing =>
          projectEffortListing.position_description
            ? projectEffortListing.service_name + ' (' + projectEffortListing.position_description + ')'
            : projectEffortListing.service_name,
      },
      {
        id: 'effort_value',
        numeric: true,
        label: intl.formatMessage({id: 'general.effort_value'}),
        format: h => formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];
  }

  projectGroupActions = (intl: IntlShape) => (
    <>
      <PrintButton
        path={'projects/' + this.props.entityId + '/effort_report'}
        title={intl.formatMessage({id: 'general.action.print_project_effort_report'})}
        urlParams={this.props.effortReportUrlParams()}
      />
      <ActionButton icon={AddEffortIcon} title={'Aufwand hinzufügen'} action={this.props.onEffortAdd} />
    </>
  )

  render() {
    return (
      <TimetrackEntityGroup
        actions={this.projectGroupActions(this.props.intl!)}
        columns={this.columns}
        displayTotal={this.props.displayTotal}
        efforts={this.props.efforts}
        onClickRow={this.props.onClickRow}
        title={this.props.title}
      />
    );
  }
}
