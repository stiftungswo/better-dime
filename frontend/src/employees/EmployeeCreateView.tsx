import * as React from 'react';
import { Employee } from '../types';
import { inject, observer } from 'mobx-react';
import { EmployeeStore } from '../store/employeeStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps, withSnackbar } from 'notistack';
import EmployeeForm from './EmployeeForm';
import compose from '../compose';

export interface Props extends RouteComponentProps, InjectedNotistackProps {
  employeeStore?: EmployeeStore;
}

@inject('employeeStore')
@observer
class EmployeeCreateView extends React.Component<Props> {
  public handleSubmit = (employee: Employee) => {
    return this.props.employeeStore!.post(employee).then(() => {
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

    return <EmployeeForm handleSubmit={this.handleSubmit} employee={employee} />;
  }
}

export default compose(withSnackbar(EmployeeCreateView));
