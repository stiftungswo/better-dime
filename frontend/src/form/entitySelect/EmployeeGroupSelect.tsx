import { inject, observer } from 'mobx-react';
import React from 'react';
import { EmployeeGroupStore } from '../../stores/employeeGroupStore';
import { EmployeeGroup } from '../../types';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  employeeGroupStore?: EmployeeGroupStore;
}

@compose(
  inject('employeeGroupStore'),
  observer,
)
export class EmployeeGroupSelect extends React.Component<Props> {
  get options() {
    return this.props.employeeGroupStore!.entities.map(e => ({
      value: e.id,
      label: e.name,
    }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
