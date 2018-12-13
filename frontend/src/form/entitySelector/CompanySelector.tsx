import * as React from 'react';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { CompanyStore } from '../../stores/companyStore';

interface Props extends FormProps {
  companyStore?: CompanyStore;
}

@compose(
  inject('companyStore'),
  observer
)
export class CompanySelector extends React.Component<Props> {
  public get options() {
    return this.props
      .companyStore!.entities.filter(c => !c.hidden || this.props.field.value === c.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} isClearable={true} />;
  }
}
