import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Overview, { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { RateGroup } from '../../types';
import compose from '../../utilities/compose';

interface Props {
  mainStore?: MainStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('mainStore', 'rateGroupStore'),
  observer,
)
export default class RateGroupOverview extends React.Component<Props> {
  columns: Array<Column<RateGroup>> = [];

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'name',
        numeric: false,
        label: 'Name',
      },
      {
        id: 'description',
        numeric: false,
        label: 'Beschreibung',
      },
    ];
  }

  render() {
    return <Overview searchable title={'Tarif-Gruppen'} store={this.props.rateGroupStore!} columns={this.columns} />;
  }
}
