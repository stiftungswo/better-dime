import * as React from 'react';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { CostgroupStore } from '../../stores/costgroupStore';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  costgroupStore?: CostgroupStore;
}

@compose(
  inject('costgroupStore'),
  observer
)
export default class CostgroupSelect extends React.Component<Props> {
  public get options() {
    return this.props.costgroupStore!.entities.map(e => ({
      value: e.number,
      label: `${e.number}: ${e.name}`,
    }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
