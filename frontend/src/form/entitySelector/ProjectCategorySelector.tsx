import * as React from 'react';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';
import { ProjectCategory, ProjectCategoryStore } from '../../stores/projectCategoryStore';

interface Props extends FormProps {
  projectCategoryStore?: ProjectCategoryStore;
}

@compose(
  inject('projectCategoryStore'),
  observer
)
export class ProjectCategorySelector extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.projectCategoryStore!.fetchAll();
  }

  public get options() {
    return this.props
      .projectCategoryStore!.entities.filter((e: ProjectCategory) => !e.archived || this.props.field.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
