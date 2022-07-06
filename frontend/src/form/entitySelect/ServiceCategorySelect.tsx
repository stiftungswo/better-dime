import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ServiceCategoryStore } from '../../stores/serviceCategoryStore';
import { ServiceCategory } from '../../types';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  serviceCategoryStore?: ServiceCategoryStore;
  nullable?: boolean;
  topLevelOnly?: boolean;
}

@compose(
  inject('serviceCategoryStore'),
  observer,
)
export class ServiceCategorySelect<T> extends React.Component<Props<T>> {
  get options() {
    const ret = this.props
      .serviceCategoryStore!.entities.filter((e: ServiceCategory) => !(!!this.props.topLevelOnly && e.parent !== null))
      .sort((e, f) => e.order - f.order)
      .map(e => ({
        value: e.id,
        label: e.order + ' ' + e.name,
      }));
    return this.props.nullable ? [{value: null, label: '<root>'}, ...ret] : ret;
  }

  render() {
    const { nullable, topLevelOnly, ...rest} = this.props;
    return <Select options={this.options} {...rest} />;
  }
}
