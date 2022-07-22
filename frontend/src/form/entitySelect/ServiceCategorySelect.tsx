import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ServiceCategoryStore } from '../../stores/serviceCategoryStore';
import { ServiceCategory, ServiceCategoryStub } from '../../types';
import compose from '../../utilities/compose';
import { prettyList, prettyName } from '../../utilities/prettyServices';
import Select, { DimeSelectFieldProps } from '../fields/Select';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  serviceCategoryStore?: ServiceCategoryStore;
  mode: 'all' | 'grouped' | 'toplevel';
  nullable?: boolean;
}

@compose(
  inject('serviceCategoryStore'),
  observer,
)
export class ServiceCategorySelect<T> extends React.Component<Props<T>> {
  get optionsToplevel() {
    const ret = this.props.serviceCategoryStore!.entities
      .filter((e: ServiceCategory) => e.parent === null)
      .sort((e, f) => e.order - f.order)
      .map(e => ({
        value: e.id,
        label: prettyName(e),
      }));
    return this.props.nullable ? [{value: null, label: '<root>'}, ...ret] : ret;
  }
  get optionsAll() {
    const ret = this.props.serviceCategoryStore!.entities
      .slice() // create copy before sorting inplace
      .sort((e, f) => e.order - f.order)
      .map(e => ({
        value: e.id,
        label: prettyName(e),
        // TODO: fetch store for projects too?
        // indent subcategories for pretty menu
        margin: e.parent === null ?  undefined : '15px',
      }));
    return this.props.nullable ? [{value: null, label: '<root>'}, ...ret] : ret;
  }
  get optionsGrouped() {
    const categories = this.props.serviceCategoryStore!.entities
      .filter((e: ServiceCategory) => e.parent !== null)
      .sort((e, f) => e.order - f.order);
    const ret = _.chain(categories)
      .groupBy(e => prettyName(e.parent!))
      // (value, key) <-- why js why?
      .map((subCategories, parentLabel) => ({
        label: parentLabel,
        options: prettyList(subCategories),
      }))
      .value();
    return this.props.nullable ? [{label: '0000', options: [{value: null, label: '0000 ---'}]}, ...ret] : ret;
  }
  get options() {
    const mode = this.props.mode;
    if (mode === 'all') {
      // both toplevel categories and subcategories, structured via indentation
      return this.optionsAll;
    } else if (mode === 'grouped') {
      // only subcategories, grouped by the toplevel category they're in
      return this.optionsGrouped;
    } else if (mode === 'toplevel') {
      // only toplevel categories
      return this.optionsToplevel;
    }
    // unreachable
    return undefined;
  }
  get isGrouped() {
    return this.props.mode === 'grouped';
  }

  render() {
    const { nullable, mode, ...rest} = this.props;
    return <Select options={this.options} isGrouped={this.isGrouped} {...rest} />;
  }
}
