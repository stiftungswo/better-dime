import { inject, observer } from 'mobx-react';
import React from 'react';
import { RateGroupStore } from '../../stores/rateGroupStore';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('rateGroupStore'),
  observer,
)
export class RateGroupSelect extends React.Component<Props> {
  get options() {
    return this.props.rateGroupStore!.entities.map(e => ({
      value: e.id,
      label: e.name,
    }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
