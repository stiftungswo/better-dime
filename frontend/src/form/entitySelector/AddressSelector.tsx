import * as React from 'react';
import { CustomerStore } from '../../stores/customerStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { Address } from '../../types';
import { computed } from 'mobx';

interface Props extends FormProps {
  customerStore?: CustomerStore;
  customerId: number;
}

@compose(
  inject('customerStore'),
  observer
)
export class AddressSelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.updateCustomerInStore();
  }

  public componentDidUpdate = (prevProps: Props) => {
    if (prevProps.customerId !== this.props.customerId) {
      this.updateCustomerInStore();
    }
  };

  protected async updateCustomerInStore() {
    if (this.props.form.values.customer_id) {
      await this.props.customerStore!.fetchOne(this.props.customerId);
    }
  }

  @computed
  public get options() {
    const customer = this.props.customerStore!.customer;
    return customer
      ? customer.addresses!.map((a: Address) => ({
          value: a.id,
          label: [a.street, a.supplement, a.postcode, a.city, a.country].filter(x => Boolean(x)).join(', '),
        }))
      : [];
  }

  public render() {
    if (this.props.customerId) {
      if (this.props.customerStore!.customer) {
        return <Select options={this.options} {...this.props} />;
      } else {
        return <Select options={[]} isDisabled placeholder={'Adressen werden abgerufen ...'} {...this.props} />;
      }
    } else {
      return <Select options={[]} isDisabled placeholder={'zuerst Kunde auswählen'} {...this.props} />;
    }
  }
}
