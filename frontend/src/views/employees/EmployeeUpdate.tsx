import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { EmployeeStore } from '../../stores/employeeStore';
import {MainStore} from '../../stores/mainStore';
import { Employee } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import EmployeeForm from './EmployeeForm';
import { editEmployeeSchema } from './employeeSchema';

interface EmployeeDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<EmployeeDetailRouterProps> {
  mainStore?: MainStore;
  employeeStore?: EmployeeStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'employeeStore'),
  observer,
)
export default class EmployeeUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.employeeStore!.fetchOne(Number(props.match.params.id));
  }

  handleSubmit = (employee: Employee) => {
    return this.props.employeeStore!.put(employee);
  }

  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.employee.update');
    const employee: Employee | undefined = this.props!.employeeStore!.employee;
    const title = employee ? `${employee.first_name} ${employee.last_name} - ` + intlText('general.employee', true) : intlText('update_employee');

    return <EmployeeForm title={title} onSubmit={this.handleSubmit} employee={toJS(employee)} schema={editEmployeeSchema} />;
  }
}
