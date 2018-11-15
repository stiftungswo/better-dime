import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import Overview, { Column } from '../../layout/Overview';
// import { TextFieldWithValidation, TextAreaWithValidation } from '../../form/fields/common';
// import { Field } from 'formik';
import { RateGroupStore, RateGroup } from '../../stores/rateGroupStore';

interface Props {
  mainStore?: MainStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('mainStore', 'rateGroupStore'),
  observer
)
export default class RateGroupOverview extends React.Component<Props> {
  public columns: Array<Column<RateGroup>> = [];

  public constructor(props: Props) {
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

  public filter = (r: RateGroup, query: string) => r.name.includes(query) || r.description.includes(query);

  public render() {
    return <Overview title={'Tarif-Gruppen'} store={this.props.rateGroupStore!} columns={this.columns} searchFilter={this.filter} />;
  }
}
