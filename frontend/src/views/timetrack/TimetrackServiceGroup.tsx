import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Column } from '../../layout/Overview';
import { ProjectEffortListing, ServiceListing } from '../../types';
import compose from '../../utilities/compose';
import { TimetrackEntityGroup } from './TimetrackEntityGroup';
import { EntityGroup, WithEfforts } from './types';

interface Props extends EntityGroup {
  loading: boolean;
  entity: ServiceListing & WithEfforts;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('effortStore', 'formatter'),
  observer,
)
export default class TimetrackServiceGroup extends React.Component<Props> {

  render() {
    const { entity } = this.props;

    const intl = this.props.intl!;
    const formatter = this.props.formatter!;
    const columns: Array<Column<ProjectEffortListing>> = [
      {
        id: 'date',
        numeric: false,
        label: intl.formatMessage({id: 'general.date'}),
        format: (e: any) => formatter.formatDate(e.date),
        defaultSort: 'desc',
      },
      {
        id: 'employee_full_name',
        numeric: false,
        label: intl.formatMessage({id: 'general.employee'}),
      },
      {
        id: 'project_name',
        numeric: false,
        label: intl.formatMessage({id: 'general.project'}),
      },
      {
        id: 'project_category_name',
        numeric: false,
        label: intl.formatMessage({id: 'general.project_category'}),
      },
      {
        id: 'position_description',
        numeric: false,
        label: intl.formatMessage({id: 'general.description'}),
      },
      {
        id: 'effort_value',
        numeric: true,
        label: intl.formatMessage({id: 'general.effort_value'}),
        format: (h: any) => formatter.formatRateEntry(h.effort_value, h.rate_unit_factor, h.effort_unit),
      },
    ];

    return <TimetrackEntityGroup columns={columns} efforts={entity.efforts} title={entity.name} onClickRow={this.props.onClickRow} />;
  }
}
