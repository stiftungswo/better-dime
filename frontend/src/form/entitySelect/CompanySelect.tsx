import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CompanyStore } from '../../stores/companyStore';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  companyStore?: CompanyStore;
}

@compose(
  inject('companyStore'),
  observer,
)
export class CompanySelect extends React.Component<Props> {
  get options() {
    return this.props
      .companyStore!.entities.filter(c => !c.hidden || this.props.value === c.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  render() {
    return <Select options={this.options} {...this.props} isClearable={true} />;
  }
}
