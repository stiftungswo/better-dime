import * as React from 'react';
import { RateUnitStore } from '../store/rateUnitStore';
import { FormProps, ValidatedFormGroupWithLabel } from './common';
import { inject, observer } from 'mobx-react';

interface Props extends FormProps {
  rateUnitStore?: RateUnitStore;
}

@inject('rateUnitStore')
@observer
export class RateUnitSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.rateUnitStore!.fetchAll();
  }

  public render() {
    return (
      <ValidatedFormGroupWithLabel label={this.props.label} field={this.props.field} form={this.props.form} fullWidth={false}>
        <select {...this.props.field}>
          {this.props.rateUnitStore!.rateUnits.map(e => (
            <option key={e.id} value={e.id}>
              {e.billing_unit}
            </option>
          ))}
        </select>
      </ValidatedFormGroupWithLabel>
    );
  }
}
