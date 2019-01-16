import * as React from 'react';
import { ProjectStore } from '../../stores/projectStore';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';

interface Props<T = number> extends DimeSelectFieldProps<T> {
  projectStore?: ProjectStore;
}

@compose(
  inject('projectStore'),
  observer
)
export class ProjectSelect<T> extends React.Component<Props<T>> {
  public get options() {
    return this.props
      .projectStore!.projects.filter(p => !p.archived || this.props.value === p.id)
      .map(e => ({
        value: e.id,
        label: `${e.id} ${e.name}`,
      }));
  }

  public render() {
    return <Select options={this.options} {...this.props} />;
  }
}
