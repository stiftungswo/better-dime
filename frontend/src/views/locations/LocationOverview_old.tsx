import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { EditableOverview } from '../../layout/EditableOverview';
import Overview, { Column } from '../../layout/Overview';
import { LocationStore } from '../../stores/locationStore';
import { MainStore } from '../../stores/mainStore';
import { Location } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

interface Props {
  mainStore?: MainStore;
  locationStore?: LocationStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'locationStore'),
  observer,
)
export default class LocationOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.location.overview');
    const columns: Array<Column<Location>> = [
      {
        id: 'id',
        numeric: false,
        label: intlText('general.number', true),
      },
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
      },
      {
        id: 'url',
        numeric: false,
        label: 'url',
      },
    ];
    return <Overview searchable title={intlText('general.location.plural', true)} store={this.props.locationStore!} columns={columns} />;
  }
}
