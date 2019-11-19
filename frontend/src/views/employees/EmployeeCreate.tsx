import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { EmployeeStore } from '../../stores/employeeStore';
import {MainStore} from '../../stores/mainStore';
import { Employee } from '../../types';
import compose from '../../utilities/compose';
import EmployeeForm from './EmployeeForm';
import { employeeTemplate, newEmployeeSchema } from './employeeSchema';

export interface Props extends RouteComponentProps {
  employeeStore?: EmployeeStore;
  mainStore?: MainStore;
}

@compose(
  inject('employeeStore'),
  inject('mainStore'),
  observer,
)
export default class EmployeeCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  handleFailure = (error: any) => {
    if (error.response.data.email) {
      this.props.mainStore!.displayError(error.response.data.email);
    }
  }

  handleSubmit = (employee: Employee) => {
    return this.props.employeeStore!.post(employee).then(() => {
      this.setState({ submitted: true });
      const idOfNewEmployee = this.props!.employeeStore!.employee!.id;
      this.props.history.replace('/employees/' + idOfNewEmployee);
    }).catch(this.handleFailure);
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
