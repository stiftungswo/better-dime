import * as React from 'react';
import { EmployeeStore } from '../../stores/employeeStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';

interface Props extends FormProps {
  employeeStore?: EmployeeStore;
}

@compose(
  inject('employeeStore'),
  observer
)
export class EmployeeSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.employeeStore!.fetchAll();
  }

  public get options() {
    return this.props.employeeStore!.employees.map(e => ({
      value: e.id,
      label: `${e.first_name} ${e.last_name}`,
    }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
