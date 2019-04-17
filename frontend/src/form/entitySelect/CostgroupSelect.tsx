import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CostgroupStore } from '../../stores/costgroupStore';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  costgroupStore?: CostgroupStore;
}

@compose(
  inject('costgroupStore'),
  observer,
)
export default class CostgroupSelect extends React.Component<Props> {
  get options() {
    return this.props.costgroupStore!.entities.map(e => ({
      value: e.number,
      label: `${e.number}: ${e.name}`,
    }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
