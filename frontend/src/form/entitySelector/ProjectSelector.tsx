import * as React from 'react';
import { ProjectStore } from '../../stores/projectStore';
import { FormProps } from '../fields/common';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select from '../fields/Select';

interface Props extends FormProps {
  projectStore?: ProjectStore;
}

@compose(
  inject('projectStore'),
  observer
)
export class ProjectSelector extends React.Component<Props> {
  public get options() {
    return this.props
      .projectStore!.projects.filter(p => !p.archived || this.props.field.value === p.id)
      .map(e => ({
        value: e.id,
        label: `${e.id} ${e.name}`,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
