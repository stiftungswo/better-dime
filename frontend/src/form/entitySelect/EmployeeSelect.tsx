import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EmployeeStore } from '../../stores/employeeStore';
import { Employee } from '../../types';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';

// TODO can we use conditional types to deal with isMulti?
interface Props<T = number> extends DimeSelectFieldProps<T> {
  employeeStore?: EmployeeStore;
  filterByIds?: number[];
}

@compose(
  inject('employeeStore'),
  observer,
)
export class EmployeeSelect<T> extends React.Component<Props<T>> {
  get options() {
    const { filterByIds } = this.props;
    return this.props
      .employeeStore!.employees.filter((e: Employee) => {
        if (e.archived && this.props.value !== e.id) {
          return false;
        }
        if (filterByIds && filterByIds.length > 0) {
          return filterByIds.includes(e.id!);
        }
        return true;
      })
      // put employees before zivis, as the former are used way more in timetrack.
      .sort((e, f) => e.group!.id - f.group!.id)
      .map(e => ({
        value: e.id,
        label: `${e.first_name} ${e.last_name}`,
      }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
