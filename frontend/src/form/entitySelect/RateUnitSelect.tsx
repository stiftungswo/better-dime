import { inject, observer } from 'mobx-react';
import React from 'react';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { RateUnit } from '../../types';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('rateUnitStore'),
  observer,
)
export class RateUnitSelect extends React.Component<Props> {
  get options() {
    return this.props
      .rateUnitStore!.rateUnits.filter((e: RateUnit) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
        archived: e.archived,
      }));
  }

  isOptionDisabled = (option: any, value: string) => {
    const containsSearch = (!value || value.length === 0 || option.data.label.toLowerCase().includes(value.toLowerCase()));
    return option.data.archived != null && !option.data.archived && containsSearch;
  }

  render() {
    return <Select options={this.options} {...this.props} filterOption={this.isOptionDisabled}/>;
  }
}
