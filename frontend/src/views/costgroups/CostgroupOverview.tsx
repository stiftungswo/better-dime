import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import Overview, { Column } from '../../layout/Overview';
import { CostgroupStore } from '../../stores/costgroupStore';
import { MainStore } from '../../stores/mainStore';
import { Costgroup } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

interface Props {
  mainStore?: MainStore;
  costgroupStore?: CostgroupStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'costgroupStore'),
  observer,
)
export default class CostGroupOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.cost_group.overview');
    const columns: Array<Column<Costgroup>> = [
      {
        id: 'number',
        numeric: false,
        label: intlText('general.number', true),
      },
      {
        id: 'number',
        numeric: false,
        label: intlText('general.number', true),
      },
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
      },
    ];
    return <Overview searchable title={intlText('general.cost_group.plural', true)} store={this.props.costgroupStore!} columns={columns} />;
  }
}
