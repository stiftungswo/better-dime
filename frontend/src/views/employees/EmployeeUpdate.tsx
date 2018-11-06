import * as React from 'react';
import { Employee } from '../../types';
import { inject, observer } from 'mobx-react';
import { EmployeeStore } from '../../stores/employeeStore';
import { RouteComponentProps } from 'react-router';
import EmployeeForm from './EmployeeForm';
import compose from '../../utilities/compose';

interface EmployeeDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<EmployeeDetailRouterProps> {
  employeeStore?: EmployeeStore;
}

@compose(
  inject('employeeStore'),
  observer
)
export default class EmployeeUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.employeeStore!.fetchOne(Number(props.match.params.id));
  }

  public handleSubmit = (employee: Employee) => {
    return this.props.employeeStore!.put(employee);
  };

  public render() {
    const employee: Employee | undefined = this.props!.employeeStore!.employee;
    const title = employee ? `${employee.first_name} ${employee.last_name} - Mitarbeiter` : 'Mitarbeiter bearbeiten';

    return <EmployeeForm title={title} onSubmit={this.handleSubmit} employee={employee} />;
  }
}
