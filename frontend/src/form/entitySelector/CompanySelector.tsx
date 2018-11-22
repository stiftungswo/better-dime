import * as React from 'react';
import { AddressStore } from '../../stores/addressStore';
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
  constructor(props: Props) {
    super(props);
    props.companyStore!.fetchAll();
  }

  public get options() {
    return this.props.companyStore!.entities.map(e => ({
      value: e.id,
      label: e.name,
    }));
  }

  public render() {
    return <Select options={this.options} {...this.props} isClearable={true} />;
  }
}
