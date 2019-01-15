import * as React from 'react';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { CompanyStore } from '../../stores/companyStore';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  companyStore?: CompanyStore;
}

@compose(
  inject('companyStore'),
  observer
)
export class CompanySelector extends React.Component<Props> {
  public get options() {
    return this.props
      .companyStore!.entities.filter(c => !c.hidden || this.props.value === c.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} isClearable={true} />;
  }
}
