import * as React from 'react';
import { ServiceStore } from '../../stores/serviceStore';
import { FormProps, ValidatedFormGroupWithLabel } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';

interface Props extends FormProps {
  serviceStore?: ServiceStore;
}

@compose(
  inject('serviceStore'),
  observer
)
export class ServiceSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.serviceStore!.fetchAll();
  }

  public render() {
    //TODO use new custom Select component
    return (
      <ValidatedFormGroupWithLabel label={this.props.label} field={this.props.field} form={this.props.form} fullWidth={false}>
        <select {...this.props.field}>
          {this.props.serviceStore!.services.map(e => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </ValidatedFormGroupWithLabel>
    );
  }
}
