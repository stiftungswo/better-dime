import { inject, observer } from 'mobx-react';
import React from 'react';
import { EffortStore } from '../../stores/effortStore';
import { ProjectStore } from '../../stores/projectStore';
import {PositionGroup} from '../../types';
import compose from '../../utilities/compose';
import {defaultPositionGroup} from '../../utilities/helpers';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  effortStore?: EffortStore;
  projectId: number;
  projectStore?: ProjectStore;
}

@compose(
  inject('effortStore', 'projectStore'),
  observer,
)
export class ProjectPositionSelect extends React.Component<Props> {

  get options() {
    if (this.props.effortStore!.selectedProject) {
      const groups = [defaultPositionGroup(), ...this.props.effortStore!.selectedProject!.position_groupings];
      return this.props.effortStore!.selectedProject!.positions.map(e => {
        const group = groups.find((g: PositionGroup) => g.id === e.position_group_id);
        const groupName = group != null && groups.length > 1 ? ' [' + group.name + ']' : '';
        return {
          value: e.id,
          label: e.service.name + groupName,
        };
      });
    } else {
      return [];
    }
  }
  componentDidMount() {
    this.updateProjectInStore();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.projectId !== prevProps.projectId) {
      this.props.onChange(null);
      this.updateProjectInStore();
    }
  }

  render() {
    if (this.props.projectId) {
      if (this.props.projectStore!.project) {
        return <Select options={this.options} {...this.props} />;
      } else {
        return <Select options={[]} isDisabled isLoading placeholder={'Projekt-Positionen werden abgerufen ...'} {...this.props} />;
      }
    } else {
      return <Select options={[]} isDisabled placeholder={'Zuerst Projekt auswählen'} {...this.props} />;
    }
  }

  protected async updateProjectInStore() {
    if (this.props.projectId) {
      await this.props.projectStore!.fetchOne(this.props.projectId);
      this.props.effortStore!.selectedProject = this.props.projectStore!.project;
    }
  }
}
