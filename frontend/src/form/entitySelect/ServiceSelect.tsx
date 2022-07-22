import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { ServiceStore } from '../../stores/serviceStore';
import { ServiceCategory, ServiceListing } from '../../types';
import compose from '../../utilities/compose';
import { detectFrench } from '../../utilities/detectFrench';
import { prettyList, prettyName } from '../../utilities/prettyServices';
import Select, { DimeSelectFieldProps } from '../fields/Select';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  serviceStore?: ServiceStore;
  categoryFilter?: number | null;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('serviceStore'),
  observer,
)
export class ServiceSelect<T> extends React.Component<Props<T>> {
  get isFrench(): boolean {
      return detectFrench(this.props.intl!);
  }
  get options() {
    return this.props
      .serviceStore!.entities.filter((e: ServiceListing) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }
  get groupedOptions() {
    const checkCategory = (e: ServiceListing) => {
      const filterId = this.props.categoryFilter;
      if (!filterId) { return true; }
      if (!e.service_category) { return false; }
      // filter can be either a toplevel category or a subcategory.
      return e.service_category.id === filterId || e.service_category.parent_category_id === filterId;
    };
    const categories = this.props.serviceStore!.entities
      .filter((e: ServiceListing) => (!e.archived && checkCategory(e)) || this.props.value === e.id)
      .sort((e, f) => e.order - f.order);
    const ret = _.chain(categories)
      .groupBy(e => prettyName(e.service_category!, this.isFrench))
      // (value, key)
      .map((services, categoryLabel) => ({
        label: categoryLabel,
        options: prettyList(services, this.isFrench),
      }))
      .value();
    return ret;
  }

  render() {
    return <Select isGrouped options={this.groupedOptions} {...this.props} />;
  }
}
