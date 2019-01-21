import React from 'react';
import { EmployeeGroupStore } from '../../stores/employeeGroupStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import { EmployeeGroup } from '../../types';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  employeeGroupStore?: EmployeeGroupStore;
}

@compose(
  inject('employeeGroupStore'),
  observer
)
export class EmployeeGroupSelect extends React.Component<Props> {
  public get options() {
    return this.props.employeeGroupStore!.entities.map(e => ({
      value: e.id,
      label: e.name,
    }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
