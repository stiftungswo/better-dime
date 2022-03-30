import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import Overview, { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { RateGroup } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

interface Props {
  mainStore?: MainStore;
  rateGroupStore?: RateGroupStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'rateGroupStore'),
  observer,
)
export default class RateGroupOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.rate_group.overview');
    const columns: Array<Column<RateGroup>> = [
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
      },
      {
        id: 'description',
        numeric: false,
        label: intlText('general.description', true),
      },
    ];
    return <Overview searchable title={intlText('general.rate_group.plural', true)} store={this.props.rateGroupStore!} columns={columns} />;
  }
}
