import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ServiceCategoryStore } from '../../stores/serviceCategoryStore';
import { ServiceCategory, ServiceCategoryStub } from '../../types';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  serviceCategoryStore?: ServiceCategoryStore;
  nullable?: boolean;
  topLevelOnly?: boolean;
}

const prettyName = (e: ServiceCategory) => e.order + ' ' + e.name;
const prettyParent = (e: ServiceCategoryStub) => e.number + '00 ' + e.name;
const prettySub = (subCategories: any[]) =>
  subCategories.map(e => ({
    value: e.id,
    label: prettyName(e),
  }));

@compose(
  inject('serviceCategoryStore'),
  observer,
)
export class ServiceCategorySelect<T> extends React.Component<Props<T>> {
  get topLevelOptions() {
    const ret = this.props.serviceCategoryStore!.entities
      .filter((e: ServiceCategory) => e.parent === null)
      .sort((e, f) => e.order - f.order)
      .map(e => ({
        value: e.id,
        label: prettyName(e),
      }));
    return this.props.nullable ? [{value: null, label: '<root>'}, ...ret] : ret;
  }
  get groupedOptions() {
    const categories = this.props.serviceCategoryStore!.entities
      .filter((e: ServiceCategory) => e.parent !== null)
      .sort((e, f) => e.order - f.order);
    const ret = _.chain(categories)
      .groupBy(e => prettyParent(e.parent!))
      // (value, key) <-- why js why?
      .map((subCategories, parentLabel) => ({
        label: parentLabel,
        options: prettySub(subCategories),
      }))
      .value();
    return this.props.nullable ? [{label: '0000', options: [{value: null, label: '0000 ---'}]}, ...ret] : ret;
  }

  render() {
    const { nullable, topLevelOnly, ...rest} = this.props;
    return <Select options={this.props.topLevelOnly ? this.topLevelOptions : this.groupedOptions} isGrouped={!this.props.topLevelOnly} {...rest} />;
  }
}
