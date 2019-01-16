import React from 'react';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('rateGroupStore'),
  observer
)
export class RateGroupSelect extends React.Component<Props> {
  public get options() {
    return this.props.rateGroupStore!.rateGroups.map(e => ({
      value: e.id,
      label: e.name,
    }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
