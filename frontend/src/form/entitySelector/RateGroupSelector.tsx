import React from 'react';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import compose from '../../utilities/compose';

interface Props extends FormProps {
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('rateGroupStore'),
  observer
)
export class RateGroupSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.rateGroupStore!.fetchAll();
  }

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
