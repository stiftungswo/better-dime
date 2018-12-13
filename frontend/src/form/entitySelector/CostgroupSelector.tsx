import * as React from 'react';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { CostgroupStore } from '../../stores/costgroupStore';

interface Props extends FormProps {
  costgroupStore?: CostgroupStore;
}

@compose(
  inject('costgroupStore'),
  observer
)
export default class CostgroupSelector extends React.Component<Props> {
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
