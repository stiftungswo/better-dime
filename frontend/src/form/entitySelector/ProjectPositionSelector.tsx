import React from 'react';
import { FormProps } from '../fields/common';
import { ProjectStore } from '../../stores/projectStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import Select from '../fields/Select';
import { EffortStore } from '../../stores/effortStore';

interface Props extends FormProps {
  effortStore?: EffortStore;
  projectId: number;
  projectStore?: ProjectStore;
}

@compose(
  inject('effortStore', 'projectStore'),
  observer
)
export class ProjectPositionSelector extends React.Component<Props> {
  componentDidMount() {
    this.updateProjectInStore();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.projectId !== prevProps.projectId) {
      this.props.form.setFieldValue(this.props.field.name, null);
      this.updateProjectInStore();
    }
  }

  protected async updateProjectInStore() {
    if (this.props.projectId) {
      await this.props.projectStore!.fetchOne(this.props.projectId);
      this.props.effortStore!.selectedProject = this.props.projectStore!.project;
    }
  }

  public get options() {
    if (this.props.effortStore!.selectedProject) {
      return this.props.effortStore!.selectedProject!.positions.map(e => ({
        value: e.id,
        label: e.service.name,
      }));
    } else {
      return [];
    }
  }

  public render() {
    if (this.props.projectId) {
      if (this.props.projectStore!.project) {
        return <Select options={this.options} {...this.props} />;
      } else {
        return <Select options={[]} isDisabled placeholder={'Projekt-Positionen werden abgerufen ...'} {...this.props} />;
      }
    } else {
      return <Select options={[]} isDisabled placeholder={'Zuerst Projekt auswählen'} {...this.props} />;
    }
  }
}
