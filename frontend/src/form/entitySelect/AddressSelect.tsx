import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { CustomerStore } from '../../stores/customerStore';
import { Address } from '../../types';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  customerStore?: CustomerStore;
  customerId?: number;
}

@compose(
  inject('customerStore'),
  observer,
)
export class AddressSelect extends React.Component<Props> {

  @computed
  get options() {
    const customer = this.props.customerStore!.customer;
    return customer
      ? customer.addresses!.map((a: Address) => ({
          value: a.id,
          label: [a.street, a.supplement, a.zip, a.city, a.country].filter(x => Boolean(x)).join(', '),
        }))
      : [];
  }
  constructor(props: Props) {
    super(props);
    this.updateCustomerInStore();
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.customerId !== this.props.customerId) {
      this.updateCustomerInStore();
    }
  }

  render() {
    if (this.props.customerId) {
      if (this.props.customerStore!.customer) {
        return <Select options={this.options} {...this.props} />;
      } else {
        return <Select options={[]} isDisabled isLoading placeholder={'Adressen werden abgerufen ...'} {...this.props} />;
      }
    } else {
      return <Select options={[]} isDisabled placeholder={'zuerst Kunde auswählen'} {...this.props} />;
    }
  }

  protected async updateCustomerInStore() {
    if (this.props.customerId) {
      await this.props.customerStore!.fetchOne(this.props.customerId);
    }
  }
}
