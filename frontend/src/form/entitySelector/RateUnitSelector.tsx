import React from 'react';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import compose from '../../utilities/compose';
import { RateUnit } from '../../types';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('rateUnitStore'),
  observer
)
export class RateUnitSelector extends React.Component<Props> {
  public get options() {
    return this.props
      .rateUnitStore!.rateUnits.filter((e: RateUnit) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
