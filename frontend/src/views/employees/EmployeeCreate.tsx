import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { EmployeeStore } from '../../stores/employeeStore';
import { Employee } from '../../types';
import compose from '../../utilities/compose';
import EmployeeForm from './EmployeeForm';
import { employeeTemplate, newEmployeeSchema } from './employeeSchema';

export interface Props extends RouteComponentProps {
  employeeStore?: EmployeeStore;
}

@compose(
  inject('employeeStore'),
  observer,
)
export default class EmployeeCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  handleSubmit = (employee: Employee) => {
    return this.props.employeeStore!.post(employee).then(() => {
      this.setState({ submitted: true });
      const idOfNewEmployee = this.props!.employeeStore!.employee!.id;
      this.props.history.replace('/employees/' + idOfNewEmployee);
    });
  }

  render() {
    return (
      <EmployeeForm
        title={'Mitarbeiter erfassen'}
        onSubmit={this.handleSubmit}
        employee={employeeTemplate}
        schema={newEmployeeSchema}
        submitted={this.state.submitted}
      />
    );
  }
}
