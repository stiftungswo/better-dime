import * as React from 'react';
import { Employee } from '../../types';
import { inject, observer } from 'mobx-react';
import { EmployeeStore } from '../../stores/employeeStore';
import { RouteComponentProps } from 'react-router';
import EmployeeForm from './EmployeeForm';
import compose from '../../utilities/compose';

export interface Props extends RouteComponentProps {
  employeeStore?: EmployeeStore;
}

@compose(
  inject('employeeStore'),
  observer
)
export default class EmployeeCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  public handleSubmit = (employee: Employee) => {
    return this.props.employeeStore!.post(employee).then(() => {
      this.setState({ submitted: true });
      const idOfNewEmployee = this.props!.employeeStore!.employee!.id;
      this.props.history.replace('/employees/' + idOfNewEmployee);
    });
  };

  public render() {
    const employee: Employee = {
      archived: false,
      email: '',
      can_login: true,
      is_admin: false,
      id: 0,
      first_name: '',
      last_name: '',
      createdAt: '',
      updatedAt: '',
      holidays_per_year: 20,
      realTime: 0,
      targetTime: 0,
      extendTimetrack: false,
      workingPeriods: [],
      password: '',
    };

    return (
      <EmployeeForm title={'Mitarbeiter erfassen'} onSubmit={this.handleSubmit} employee={employee} submitted={this.state.submitted} />
    );
  }
}
