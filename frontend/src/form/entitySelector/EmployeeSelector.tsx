import * as React from 'react';
import { EmployeeStore } from '../../stores/employeeStore';
import { FormProps, ValidatedFormGroupWithLabel } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';

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

  public render() {
    //TODO use new custom Select component
    return (
      <ValidatedFormGroupWithLabel label={this.props.label} field={this.props.field} form={this.props.form} fullWidth={false}>
        <select {...this.props.field}>
          {this.props.employeeStore!.employees.map(e => (
            <option key={e.id} value={e.id}>
              {e.first_name} {e.last_name}
            </option>
          ))}
        </select>
      </ValidatedFormGroupWithLabel>
    );
  }
}
