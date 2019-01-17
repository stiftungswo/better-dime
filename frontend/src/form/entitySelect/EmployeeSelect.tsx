import * as React from 'react';
import { EmployeeStore } from '../../stores/employeeStore';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';
import { Employee } from '../../types';

//TODO can we use conditional types to deal with isMulti?
interface Props<T = number> extends DimeSelectFieldProps<T> {
  employeeStore?: EmployeeStore;
}

@compose(
  inject('employeeStore'),
  observer
)
export class EmployeeSelect<T> extends React.Component<Props<T>> {
  public get options() {
    return this.props
      .employeeStore!.employees.filter((e: Employee) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: `${e.first_name} ${e.last_name}`,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}