import * as React from 'react';
import { Employee } from '../types';
import { inject, observer } from 'mobx-react';
import { EmployeeStore } from '../store/employeeStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps, withSnackbar } from 'notistack';
import EmployeeForm from './EmployeeForm';
import compose from '../compose';

interface EmployeeDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<EmployeeDetailRouterProps>, InjectedNotistackProps {
  employeeStore?: EmployeeStore;
}

@inject('employeeStore')
@observer
class EmployeeUpdateView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.employeeStore!.fetchOne(Number(props.match.params.id));
  }

  public handleSubmit = (employee: Employee) => {
    return this.props.employeeStore!.put(employee);
  };

  public render() {
    const employee: Employee | undefined = this.props!.employeeStore!.employee;

    return <EmployeeForm handleSubmit={this.handleSubmit} employee={employee} />;
  }
}

export default compose(withSnackbar(EmployeeUpdateView));
