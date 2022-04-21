import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { CustomerStore } from '../../stores/customerStore';
import { Address } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  customerStore?: CustomerStore;
  customerId?: number;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('customerStore'),
  observer,
)
export class AddressSelect extends React.Component<Props> {

  @computed
  get options() {
    const customer = this.props.customerStore!.entity;
    return customer
      ? customer.addresses!
        .filter(a => this.props.value === a.id || !a.hidden)
        .map((a: Address) => ({
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
    const intlText = wrapIntl(this.props.intl!, 'form.entity_select.address_select');
    if (this.props.customerId) {
      if (this.props.customerStore!.entity) {
        return <Select options={this.options} {...this.props} />;
      } else {
        return <Select options={[]} isDisabled isLoading placeholder={intlText('wait_fetching')} {...this.props} />;
      }
    } else {
      return <Select options={[]} isDisabled placeholder={intlText('missing_customer')} {...this.props} />;
    }
  }

  protected async updateCustomerInStore() {
    if (this.props.customerId) {
      await this.props.customerStore!.fetchOne(this.props.customerId);
    }
  }
}
