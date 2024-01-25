import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { CostgroupStore } from '../../stores/costgroupStore';
import {EffortStore} from '../../stores/effortStore';
import {ProjectStore} from '../../stores/projectStore';
import {Costgroup} from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import {DimeCustomFieldProps} from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<number | null> {
  effortStore?: EffortStore;
  costgroupStore?: CostgroupStore;
  projectStore?: ProjectStore;
  projectId?: number | null;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('costgroupStore', 'effortStore', 'projectStore'),
  observer,
)
export default class CostgroupSelect extends React.Component<Props> {
  get options() {
    if (this.props.projectId === undefined || this.props.projectId === null) {
      return this.props.costgroupStore!.entities.map(e => ({
        value: e.number,
        label: `${e.number}: ${e.name}`,
      }));
    } else {
      if (this.props.effortStore!.selectedProject) {
        const costgroupIds = this.props.effortStore!.selectedProject!.costgroup_distributions.map(cd => cd.costgroup_number);

        return this.props
            .costgroupStore!
            .entities
            .filter((e: Costgroup) => costgroupIds.includes(e.number))
            .map(e => ({
          value: e.number,
          label: `${e.number}: ${e.name}`,
        }));
      } else {
        return [];
      }
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
    const intlText = wrapIntl(this.props.intl!, 'form.entity_select.costgroup_select');
    if (this.props.projectId) {
      if (this.props.projectStore!.project) {
        return <Select options={this.options} {...this.props} />;
      } else {
        return <Select options={[]} isDisabled isLoading placeholder={intlText('wait_fetching')} {...this.props} />;
      }
    } else {
      return <Select options={this.options} {...this.props} />;
    }
  }

  protected async updateProjectInStore() {
    if (this.props.projectId) {
      await this.props.projectStore!.fetchOne(this.props.projectId);
      this.props.effortStore!.selectedProject = this.props.projectStore!.project;
    }
  }
}
