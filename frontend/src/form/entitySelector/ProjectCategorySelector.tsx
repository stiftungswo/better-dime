import * as React from 'react';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { ProjectCategory } from '../../types';
import { DimeCustomFieldProps } from '../fields/common';

interface Props extends DimeCustomFieldProps<number | null> {
  projectCategoryStore?: ProjectCategoryStore;
}

@compose(
  inject('projectCategoryStore'),
  observer
)
export class ProjectCategorySelector extends React.Component<Props> {
  public get options() {
    return this.props
      .projectCategoryStore!.entities.filter((e: ProjectCategory) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
