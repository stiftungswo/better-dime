import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { Category } from '../../types';
import compose from '../../utilities/compose';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  projectCategoryStore?: ProjectCategoryStore;
}

@compose(
  inject('projectCategoryStore'),
  observer,
)
export class ProjectCategorySelect extends React.Component<Props> {
  get options() {
    return this.props
      .projectCategoryStore!.entities.filter((e: Category) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
